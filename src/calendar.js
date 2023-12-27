

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

window.onload = function() {
    var select = document.getElementById("hour");
    for(var i = 7; i <= 18; i++) {
        var option = document.createElement("option");
        var hour = i < 10 ? "0" + i : i; // Add leading zero to single digit hours
        hour += ":00"; // Append ":00" to the hour
        option.value = hour;
        option.text = hour;
        select.appendChild(option);
    }
}
window.onload = function() {
    var select = document.getElementById("hour");

    // Fetch appointments from Firebase
    firebase.database().ref('appointments').once('value', function(snapshot) {
        var appointments = snapshot.val();

        // Create an array of booked hours
        var bookedHours = [];
        for(var key in appointments) {
            bookedHours.push(appointments[key].time);
        }

        // Create options for each hour
        for(var i = 7; i <= 18; i++) {
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