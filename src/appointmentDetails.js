async function displayAvailableHours(date) {
    const hoursSection = document.getElementById('hoursSection');
    hoursSection.innerHTML = '';

    const appointments = await fetchAppointments(date, tags[currentTagIndex]);

    for(let hour = 7; hour <= 17; hour++) {
        const hourDiv = document.createElement('div');
        hourDiv.classList.add("hour", "flex", "flex-wrap", "text-center", "text-white", "w-20", "rounded-md", "p-2", "mt-2");
        const appointment = appointments.find(appointment => parseInt(appointment.time.split(':')[0]) === hour);

        if(appointments.some(appointment => parseInt(appointment.time.split(':')[0]) === hour)) {
            hourDiv.classList.add("bg-red-500","cursor-pointer");
            hourDiv.addEventListener('click', () => displayAppointmentDetails(appointment));
        } else {
            hourDiv.classList.add("bg-green-200", "cursor-pointer");
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

    if (!appointments) {
        return [];
    }

    const appointmentsArray = Object.keys(appointments).map(key => {
        const appointment = appointments[key];
        return {
            ...appointment,
            id: key
        };
    });

    const [year, month, day] = date.split('-').map(Number);

    const formattedDate = new Date(Date.UTC(year, month - 1, day)).toISOString().split('T')[0];

    const filteredAppointments = appointmentsArray.filter(appointment =>
        appointment.date === formattedDate && appointment.tag === tag
    );

    return filteredAppointments;
}

function displayAppointmentDetails(appointment) {
    const appointmentDetailsDiv = document.getElementById('appointmentDetails');

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

    appointmentDetailsDiv.innerHTML = html;
}

document.addEventListener('click', function(event) {
    if (!event.target.classList.contains('hour')) {
        const appointmentDetailsDiv = document.getElementById('appointmentDetails');
        appointmentDetailsDiv.innerHTML = '';
    }
});

const modal = document.getElementById('appointmentModal');

function showModal() {
    modal.classList.remove('hidden');
}

function hideModal() {
    modal.classList.add('hidden');
}

window.onclick = function(event) {
    if (event.target == modal) {
        hideModal();
    }
}