/* getBooking is responsible for calling the DB and getting all bookings that are currently
unassigned within 2 hours from now. It will then update the html document with these
bookings */
function getBooking(alertMsg) {
	var xhr = new XMLHttpRequest();
	var tableBody = document.getElementById("bookingBody");
	tableBody.innerHTML = ""; //Ensure table is cleared before updating
	var bookings = []; //Hold the returned bookings
	if (xhr) {
		xhr.open('GET', 'getBookings.php', false); //False for getting
		xhr.setRequestHeader("Content-Type", " text/plain");
		xhr.onreadystatechange = function () {
			// alert(xhr.readyState);
			if (xhr.readyState === 4 && xhr.status === 200) {
				bookings = JSON.parse(xhr.responseText); //Must parse as JSON
			}
		}
		xhr.send(); //Call the php script
	}
	if (bookings) {
		bookings.forEach(function (element) { 	//Loop through each booking
			//Create a new row, and splice the boking into usable sections
			var newRow = document.createElement("tr");
			var bookingInfo = element.splice(",");
			bookingInfo.push("button"); //adds the assign button to the end of array

			bookingInfo.forEach(function (infoElement) {	//Loop through each element of each booking
				if (infoElement === "button") {
					//Create the button element at the end of the loop
					var newCol = document.createElement("td");
					var newButton = document.createElement("button");
					newButton.appendChild(document.createTextNode("Assign!"));
					newButton.onclick = function () { bookBooking(bookingInfo[0]) };
					newCol.appendChild(newButton);
					newRow.appendChild(newCol);
					tableBody.appendChild(newRow);
				} else {
					// Create the regular text elements
					var newCol = document.createElement("td");
					var textNode = document.createTextNode(infoElement);
					newCol.appendChild(textNode);
					newRow.appendChild(newCol);
					tableBody.appendChild(newRow);
				}
			})
		})
	} else if (alertMsg) {
		alert("There are no avaliable booking within 2 hours!")
	}

}

/* bookBooking will change a specific booking's status to assigned if requested */
function bookBooking(bookingRef) {
	var message = "";
	var xhr = new XMLHttpRequest();
	var requestbody = " & bookRef=" + encodeURIComponent(bookingRef); //Pass booking ref to the php file
	if (xhr) {
		xhr.open('POST', 'updateBooking.php', true);
		xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function () {
			// alert(xhr.readyState);
			if (xhr.readyState === 4 && xhr.status === 200) {
				message = JSON.parse(xhr.responseText); //Response from xhr
				var assignTableBody = document.getElementById("assignedBody");
				var newRow = document.createElement("tr");
				var newCol = document.createElement("td");
				var textNode = document.createTextNode(message);
				newCol.appendChild(textNode);
				newRow.appendChild(newCol);
				assignTableBody.appendChild(newRow);
			}
		}
		xhr.send(requestbody);
	}
	getBooking(false); //Reload the bookings table - Just assigned booking should dissapear
}