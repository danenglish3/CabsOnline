Daniel English - 14850842

The files in this system are as follows:

    CSS:
        bootstrap.min.css   -   THis is the main bootstrap css file
        style.css   -   Custom css file. Used by the template
        background.jpg  -   BG used for booking page

    Booking Page:
        booking.html    -   hold all releveant html info on booking Page\
        scripts.js  -   Holds all ajax scripts for creating new bookings
        addBooking.php  -   PHP script for adding a new booking to the DB

    Admin Page:
        admin.html  -   The front page for the admin requirements
        adminScripts.js     -   Holds all ajax scripts refereing to the admin page
        getBooking.php  -   This PHP script gets all bookings that are unassigned within 2 hours from now
        upDateBooking.php   -   This PHP script updates a booking's status to assigned

    MISC:
        mySQL_commands  -   Holds the DB Creation query used in phpmyadmin
        xhr.js  -   The XHR creation script
        READ_ME.txt     -   This file.

How to use this system

It is recommended to use this system tby firstly:

    1.  Open booking.html and create some bookings - Ensuring that some of the bookings
        are for today, and within 2 hours as to properly execute the testing of the program

    2.  Once some bookings have been created, navigate to the admin page (or click the link) and click the
        update bookings button.

    3. Once this button has been pressed, all the "unassigned" bookings within 2 hours from the current time will been
        listed in the un-assigned bookings table.

    4.  To assign these bookings you can click on the assign booking button to the right of each booking.

    5. Once assigned, the assigned bookings table will be updated, and the un-assigned bookings table will be refreshed
        and wont display the newly assigned booking.

    6. Navigate between pages by using the link at the top right of each page.
