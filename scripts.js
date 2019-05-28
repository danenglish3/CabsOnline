function submitForm() {

    var name = document.getElementById('nameField').value;
    var phone = document.getElementById('phoneField').value
    var unit = document.getElementById('unitField').value
    var streetNum = document.getElementById('streetNumberField').value
    var streetName = document.getElementById('streetNameField').value
    var streetSuburb = document.getElementById('streetSuburbField').value
    var destSub = document.getElementById('destSuburbField').value
    var date = document.getElementById('chooseDate').value
    var hour = document.getElementById('hourField').value
    var min = document.getElementById('minField').value
    var time = document.getElementById('timeField').value

    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    var bookingNum = name+array[0];
    

    var validTime = checkTime(date, hour, min, time);
    if (!validTime) {
        alert("That time has passed")
    } else {

        var completePickUpDate = generateDate(date, hour, min, time, "array");
        // console.log(completePickUpDate);

        addData(name, phone, unit, streetNum, streetName, streetSuburb, destSub, completePickUpDate, bookingNum);
    }
}

function addData(name, phone, unit, streetNum, streetName, streetSuburb, destSub, completePickUpDate, bookingNum) {
    var xhr = new XMLHttpRequest();
    var requestbody = "& bookingNum=" + encodeURIComponent(bookingNum) + "& names=" + encodeURIComponent(name) + " & phone=" + encodeURIComponent(phone) + " & unit=" + encodeURIComponent(unit)
        + " & streetNum=" + encodeURIComponent(streetNum) + " & streetName=" + encodeURIComponent(streetName) + " & streetSuburb=" + encodeURIComponent(streetSuburb)
        + " & destSub=" + encodeURIComponent(destSub) + " & completePickUpDate=" + encodeURIComponent(JSON.stringify(completePickUpDate));
    if (xhr) {
        xhr.open('POST', 'addBooking.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            // alert(xhr.readyState); // to let us see the state of the computation
            if (xhr.readyState == 4 && xhr.status == 200) {
               // var test = JSON.parse(xhr.responseText);

                var bodyElement = document.getElementById("bookingConfirmation");
                if(completePickUpDate[4] === 0){
                    completePickUpDate[4] = "00";
                }
                console.log(completePickUpDate[4]);
                bodyElement.innerHTML = "<br><br>Thank you! Your booking reference number is:<br>" + bookingNum + "<br><br> You will be picked up in front of your provided address at:<br>"
                + completePickUpDate[3]+":"+completePickUpDate[4] + " on " + completePickUpDate[2] + "/" +completePickUpDate[1] + "/" + completePickUpDate[0];

            } // end if
        } // end anonymous call-back function
        xhr.send(requestbody);
    } // end if
}

function generateDate(date, hour, min, time, howToReturn) {
    var values = date.split("-");
    var hourAsInt = parseInt(hour);
    var minAsInt = parseInt(min);
    console.log(values);
    if (time === 'PM') {
        hourAsInt += 12;
    }

    var bookDate = new Date()
    bookDate.setFullYear(values[0], parseInt(values[1]) - 1, values[2]);
    bookDate.setHours(hourAsInt, minAsInt);

    if (howToReturn === "date") {
        return bookDate;
    } else if (howToReturn === "array") {
        var dateArray = [];
        dateArray[0] = parseInt(values[0]);
        dateArray[1] = parseInt(values[1]);
        dateArray[2] = parseInt(values[2]);
        dateArray[3] = hourAsInt;
        dateArray[4] = minAsInt;
        return dateArray;
    }
}

function checkTime(date, hour, min, time) {

    var bookDate = generateDate(date, hour, min, time, "date");

    var today = new Date();

    if (bookDate < today) {
        console.log("the time is wrong");
        return false;
    } else {
        return true;
    }
}


//This script will check if the date is before today. If it is it will alert the user and clear the date field
function checkDate() {
    var date = document.getElementById('chooseDate').value; //Get date from form
    var todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);
    var dt1 = Date.parse(todaysDate); //convert to usable dates
    console.log(dt1);
    var dt2 = Date.parse(date);
    console.log(dt2);
    if (dt2 < dt1) { //if in past prompt
        alert("That date is in the past");
        var toReset = document.getElementById('chooseDate');
        toReset.value = toReset.defaultValue;
    }
}