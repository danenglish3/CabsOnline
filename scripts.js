/*  Daniel English - 14850842
    scripts.js holds all the relevent scripts for the booking.html page */

/* submitForm is the main function called from the booking.html page when the form is submitted */
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

    //This section will create a random numeric digit for the reference number
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);   //Generates a random number
    var bookingNum = name + array[0]; //Ref becomes the name + the random number

    // CHeck if the user entered time is in the past or not
    var validTime = checkTime(date, hour, min, time);
    if (!validTime) {
        alert("That time has passed")
    }
    if (!validateData(name, phone, unit, streetNum, streetName, streetSuburb, destSub, validTime)) { //Vallidate user input data
    } else {
        //If the data is all valid it will call the function for inserting to the DB
        var completePickUpDate = generateDate(date, hour, min, time, "array");

        addData(name, phone, unit, streetNum, streetName, streetSuburb, destSub, completePickUpDate, bookingNum);
    }
}

/* validateData validates the users inputs and will send alerts to the user if they
are incorrect.

This is done using regular expressions to match words and numbers*/
function validateData(name, phone, unit, streetNum, streetName, streetSuburb, destSub, validTime) {
    var dataOk = true;
    var stringReg = /\b[^\d\W]+\b/;
    var digitReg = /\b[\d]+\b/;
    if (!(stringReg.test(name))) {
        dataOk = false;
        alert("Incorect name format");
    }
    if (!(stringReg.test(unit)) && !(unit === "")) {
        dataOk = false;
        alert("Incorect unit format");
    }
    if (!(stringReg.test(streetName))) {
        dataOk = false;
        alert("Incorect street name format");
    }
    if (!(stringReg.test(streetSuburb))) {
        dataOk = false;
        alert("Incorect street suburb format");
    }
    if (!(stringReg.test(destSub))) {
        dataOk = false;
        alert("Incorect destination suburb format");
    }
    if (!(digitReg.test(phone))) {
        dataOk = false;
        alert("Incorect phone format");
    }
    if (!(digitReg.test(streetNum))) {
        dataOk = false;
        alert("Incorect street number format");
    }
    if (!validTime) {
        dataOk = false;
    }
    return dataOk;
}

/* addData is the function that will create a XML request and insert the user entered
data into the database using a php script found in 'addBooking.php' */
function addData(name, phone, unit, streetNum, streetName, streetSuburb, destSub, completePickUpDate, bookingNum) {
    var xhr = new XMLHttpRequest();

    //request body encodes the user data so it can be read in the php script
    var requestbody = "& bookingNum=" + encodeURIComponent(bookingNum) + "& names=" + encodeURIComponent(name) + " & phone=" + encodeURIComponent(phone) + " & unit=" + encodeURIComponent(unit)
        + " & streetNum=" + encodeURIComponent(streetNum) + " & streetName=" + encodeURIComponent(streetName) + " & streetSuburb=" + encodeURIComponent(streetSuburb)
        + " & destSub=" + encodeURIComponent(destSub) + " & completePickUpDate=" + encodeURIComponent(JSON.stringify(completePickUpDate));
    if (xhr) {
        xhr.open('POST', 'addBooking.php', true); //Open request as post
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) { //IF the request completed successfully
                var bodyElement = document.getElementById("bookingConfirmation");   //Send confirmation to the booking.html page
                if (completePickUpDate[4] === 0) {
                    completePickUpDate[4] = "00";
                }
                bodyElement.innerHTML = "<br><br>Thank you! Your booking reference number is:<br>" + bookingNum + "<br><br> You will be picked up in front of your provided address at:<br>"
                    + completePickUpDate[3] + ":" + completePickUpDate[4] + " on " + completePickUpDate[2] + "/" + completePickUpDate[1] + "/" + completePickUpDate[0];
            }
        }
        xhr.send(requestbody); //Ensure to send the request body to the data transfer
    }
}

/* generateDate will create a javascript date with the given values.
It has to options of how to return a date - as a date object or as an array.
If an array is chosen, each part of the date object will become its own element

e.g. 2019-05-19 14-50-00 would become
    [0] = 2019 
    [1] = 05
    [2] = 19
    [3] = 14
    [4] = 50*/
function generateDate(date, hour, min, time, howToReturn) {
    var values = date.split("-");
    var hourAsInt = parseInt(hour);
    var minAsInt = parseInt(min);
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

/* checkTime is used to check if the user entered time is in the past */
function checkTime(date, hour, min, time) {

    var bookDate = generateDate(date, hour, min, time, "date"); //generate a Javascript date using the user values

    var today = new Date(); //new Date makes a date relating to the time it is now

    if (bookDate < today) {
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
    var dt2 = Date.parse(date);

    if (dt2 < dt1) { //if in past prompt
        alert("That date is in the past");
        //Reset the time boxes on booking page to default values
        var toReset = document.getElementById('chooseDate');
        toReset.value = toReset.defaultValue;
    }
}