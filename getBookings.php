<?php
	/* 	Daniel English - 14850842
		getBookings.php is used as a data transfer for getting unassigned bookings within 2 hours from now*/
	require_once("../../conf/settings.php"); //please make sure the path is correct
	$conn = @mysqli_connect( $host,
	$user,
	$pswd,
	$dbnm );

 	if(!$conn){
		$toReturn = "DB connection failure";
	} else {
 		$sql_query = "SELECT `bookingRefNo`,`bookingName`,`phone`,`streetSuburb`,`destinationSuburb`,`pickupDateTime`FROM `booking` WHERE `status` = \"unassigned\" AND (pickupDateTime <= NOW() + INTERVAL 2 HOUR AND pickupDateTime >= NOW())";
		$result = mysqli_query($conn, $sql_query);
		if(mysqli_num_rows($result)==0){
			$toReturn = false;
		} else {
            while($row = $result->fetch_row()){
				$toReturn[] = $row;
			}
			mysqli_free_result($result);
		}
	}
	echo json_encode($toReturn);
?>
