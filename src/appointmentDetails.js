async function displayAvailableHours(date) {
    const hoursSection = document.getElementById('hoursSection');
    hoursSection.innerHTML = ''; // Clear the hours section first
  
    // Fetch appointments for the selected date and tag
    const appointments = await fetchAppointments(date, tags[currentTagIndex]);
    console.log(appointments); // Log the fetched appointments
  
    for(let hour = 7; hour <= 17; hour++) {
        const hourDiv = document.createElement('div');
        hourDiv.classList.add("hour", "flex", "flex-wrap", "text-center", "text-white", "w-20", "rounded-md", "p-2", "mt-2");
        const appointment = appointments.find(appointment => parseInt(appointment.time.split(':')[0]) === hour);

        if(appointments.some(appointment => parseInt(appointment.time.split(':')[0]) === hour)) {
            console.log(`Appointment found at ${hour}:00`); // Log when an appointment is found
            hourDiv.classList.add("bg-red-500","cursor-pointer"); // If there's an appointment, make the background red
            hourDiv.addEventListener('click', () => displayAppointmentDetails(appointment));
        } else {
            hourDiv.classList.add("bg-green-200", "cursor-pointer"); // If there's no appointment, make the background blue
            hourDiv.addEventListener('click', () => showModal());
        }
        hourDiv.innerText = `${hour}:00 - ${hour + 1}:00`;
        hoursSection.appendChild(hourDiv);
    }
}
  
async function fetchAppointments(date, tag) {
    const dbRef = firebase.database().ref('appointments');
    const snapshot = await dbRef.once('value');
    const appointments = snapshot.val();
    console.log(appointments); // Log the fetched appointments

    if (!appointments) {
        return []; // Return an empty array if there are no appointments
    }

    // Convert the appointments object to an array
    const appointmentsArray = Object.keys(appointments).map(key => {
        const appointment = appointments[key];
        return {
            ...appointment,
            id: key
        };
    });
    console.log(appointmentsArray); // Log the appointments array

    // Filter appointments for the selected date and tag
    // Format the selected date to match the format in the database

    // Parse the year, month, and day from the selected date
    const [year, month, day] = date.split('-').map(Number);

    // Create a new Date object in UTC
    const formattedDate = new Date(Date.UTC(year, month - 1, day)).toISOString().split('T')[0];

    // Filter appointments for the selected date and tag
    const filteredAppointments = appointmentsArray.filter(appointment =>
        appointment.date === formattedDate && appointment.tag === tag
    );
    console.log(filteredAppointments); // Log the filtered appointments

    return filteredAppointments;
}

function displayAppointmentDetails(appointment) {
    // Get the appointmentDetails div
    const appointmentDetailsDiv = document.getElementById('appointmentDetails');

    // Create a new HTML string with the appointment details
    const html = `
    <div class="p-4 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Appointment Details</h2>
    <p class="mb-2 "><span class="font-bold">Name:</span> ${appointment.name}</p>
    <p class="mb-2"><span class="font-bold">Tag:</span> ${appointment.tag}</p>
    <p class="mb-2"><span class="font-bold">Phone:</span> ${appointment.phone}</p>
    <p class="mb-2"><span class="font-bold">Email:</span> ${appointment.email}</p>
    <p class="mb-2"><span class="font-bold">Date:</span> ${appointment.date}</p>
    <p class="mb-2"><span class="font-bold">Time:</span> ${appointment.time}</p>
</div>
`;

    // Set the innerHTML of the appointmentDetails div to the new HTML string
    appointmentDetailsDiv.innerHTML = html;
}

// Add a click event listener to the document
document.addEventListener('click', function(event) {
    // Check if the target of the event is an hourDiv
    if (!event.target.classList.contains('hour')) {
        // If it's not, clear the appointmentDetails div
        const appointmentDetailsDiv = document.getElementById('appointmentDetails');
        appointmentDetailsDiv.innerHTML = '';
    }
});
// Get the modal
const modal = document.getElementById('appointmentModal');

// Function to show the modal
function showModal() {
    modal.classList.remove('hidden');
}

// Function to hide the modal
function hideModal() {
    modal.classList.add('hidden');
}

// Show the modal when the page loads

// Hide the modal when the user clicks outside the form
window.onclick = function(event) {
    if (event.target == modal) {
        hideModal();
    }
}