<?php
/* Daniel English - 14850842
		addBooking.php - PHP Script file for adding a booking to the DB */
		
	// get name and password passed from client
	 $bookRef = $_POST['bookingNum'];
 		$nametouse = $_POST['names'];
    $phone = $_POST['phone'];
    $unit = $_POST['unit'];
    $streetNum = $_POST['streetNum'];
    $streetName = $_POST['streetName'];
    $streetSuburb = $_POST['streetSuburb'];
		$destSub = $_POST['destSub'];
    $completePickUpDate = json_decode($_POST['completePickUpDate']);
		$bookedDate = date('Y-m-d H:i:s');
		

	$idate=sprintf('%04d-%02d-%02d %02d:%02d:00', $completePickUpDate[0], $completePickUpDate[1], $completePickUpDate[2], $completePickUpDate[3], $completePickUpDate[4]);

	require_once("../../conf/settings.php"); //please make sure the path is correct
	$conn = @mysqli_connect( $host,
	$user,
	$pswd,
	$dbnm );

 	if(!$conn){
		$toReturn = "DB connection failure";
	} else {
  			$sql_query = "INSERT INTO `booking` (`bookingRefNo`,bookingName,phone,unit,streetNumber,streetName,streetSuburb,destinationSuburb,bookedDate,pickupDateTime)
				 VALUES ('$bookRef','$nametouse','$phone','$unit','$streetNum','$streetName','$streetSuburb','$destSub','$bookedDate','$idate')";
				 
		if($conn ->query($sql_query) === TRUE){
			echo json_encode("Successfully entered into db");
		} else {
			echo json_encode("something happened" . mysqli_error($conn). $bookRef);
		}
		$conn -> close();
  }
?>