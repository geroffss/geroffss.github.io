

document.getElementById('appointment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var tag = document.getElementById('tag').value;
    var date = document.getElementById('date').value;
    var hour = document.getElementById('hour').value;

    // Save the appointment to Firebase
    firebase.database().ref('appointments').push({
        name: name,
        email: email,
        phone: phone,
        tag: tag,
        date: date,
        time: hour
    });

    // Clear the form
    event.target.reset();
});

function updateHours() {
    var select = document.getElementById("hour");
    select.innerHTML = ""; // Clear the select element

    var selectedTag = document.getElementById('tag').value;
    var selectedDate = document.getElementById('date').value;

    // Fetch appointments from Firebase
    firebase.database().ref('appointments').once('value', function(snapshot) {
        var appointments = snapshot.val();

        // Create an array of booked hours
        var bookedHours = [];
        for(var key in appointments) {
            var appointment = appointments[key];
            if (appointment.date === selectedDate && appointment.tag === selectedTag) {
                bookedHours.push(appointment.time);
            }
        }

        // Create options for each hour
        for(var i = 7; i <= 17; i++) {
            var option = document.createElement("option");
            var hour = i < 10 ? "0" + i : i; // Add leading zero to single digit hours
            hour += ":00"; // Append ":00" to the hour

            // Disable the option if the hour is booked
            if(bookedHours.includes(hour)) {
                option.disabled = true;
            }

            option.value = hour;
            option.text = hour;
            select.appendChild(option);
        }
    });
}

window.onload = function() {
    // Add event listeners to the date and tag elements
    document.getElementById('date').addEventListener('change', updateHours);
    document.getElementById('tag').addEventListener('change', updateHours);
}
