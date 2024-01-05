let currentDate = new Date();
let currentTagIndex = 0;
const tags = ["tag1", "tag2", "tag3", "tag4"];
const fullCalendarDiv = document.getElementById("fullCalendar");

function initCalendarHeader() {
  const calendarHeader = document.createElement("div");
  calendarHeader.className =
    "flex items-center justify-between px-6 py-3 bg-purple-700";

  const prevButton = document.createElement("button");
  prevButton.id = "prevMonth";
  prevButton.className = "text-white hover:bg-purple-600 p-2 rounded";
  prevButton.innerText = "Previous";
  calendarHeader.appendChild(prevButton);

  const currentMonthDiv = document.createElement("div");
  currentMonthDiv.id = "currentMonth";
  currentMonthDiv.className = "text-white";
  calendarHeader.appendChild(currentMonthDiv);

  const nextButton = document.createElement("button");
  nextButton.id = "nextMonth";
  nextButton.className = "text-white hover:bg-purple-600 p-2 rounded";
  nextButton.innerText = "Next";
  calendarHeader.appendChild(nextButton);

  fullCalendarDiv.appendChild(calendarHeader);
}

renderCalendar();

function renderCalendar() {
  return new Promise((resolve) => {
    fullCalendarDiv.innerHTML = "";
    initCalendarHeader();

    const tag = tags[currentTagIndex];
    const calendarDiv = document.createElement("div");
    calendarDiv.id = `calendar-${tag}`;
    calendarDiv.className = "bg-white overflow-auto rounded-lg p-5";
    fullCalendarDiv.appendChild(calendarDiv);

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const daysInPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();

    let date = 1;
    let prevMonthDate = daysInPreviousMonth - firstDayOfMonth + 1;
    let nextMonthDate = 1;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create a row for the day names
    const dayNamesRow = document.createElement('div');
    dayNamesRow.className = "grid grid-cols-7 gap-2 font-bold";
    
    // Create a div for each day name and append it to the dayNamesRow
    for (let i = 0; i < dayNames.length; i++) {
        const dayNameDiv = document.createElement('div');
        dayNameDiv.className = "text-center w-20 rounded-md p-2";
        dayNameDiv.innerText = dayNames[i];
        dayNamesRow.appendChild(dayNameDiv);
    }
    
    // Append the dayNamesRow to the calendarDiv
    calendarDiv.appendChild(dayNamesRow);
    for (let i = 0; i < 6; i++) {
      const weekRow = document.createElement("div");
      weekRow.className = "grid grid-cols-7 gap-2 mt-2";
      for (let j = 0; j < 7; j++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = "text-center w-20 rounded-md p-2";
        if (i === 0 && j < firstDayOfMonth) {
          dateDiv.innerText = prevMonthDate++;
          dateDiv.className += " text-gray-400 bg-gray-200";
        } else if (date > daysInMonth) {
          dateDiv.innerText = nextMonthDate++;
          dateDiv.className += " text-gray-400 bg-gray-200";
        } else {
          dateDiv.innerText = date++;
          dateDiv.className += " hover:bg-blue-200 date cursor-pointer";
          dateDiv.dataset.date = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${dateDiv.innerText}`;
          dateDiv.addEventListener('click', () => {
            logSelectedDateAndTag(dateDiv.dataset.date);
            displayAvailableHours(dateDiv.dataset.date);

          });
        }
        weekRow.appendChild(dateDiv);
      }
      calendarDiv.appendChild(weekRow);
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    document.getElementById("currentMonth").innerHTML = `${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;

    document.getElementById("nextMonth").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    document.getElementById("prevMonth").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    resolve();
  });
}

renderCalendar();

document.getElementById("tagSelect").addEventListener("change", (event) => {
  // Parse the new tag index
  currentTagIndex = parseInt(event.target.value, 10);

  // Clear the appointmentDetails div
  const appointmentDetailsDiv = document.getElementById('appointmentDetails');
  appointmentDetailsDiv.innerHTML = '';

  // Remove the hourDiv elements
  const hoursSection = document.getElementById('hoursSection');
  while (hoursSection.firstChild) {
    hoursSection.removeChild(hoursSection.firstChild);
  }

  // Re-render the calendar
  renderCalendar();
});
function logSelectedDateAndTag(date) {
  console.log(`Selected date: ${date}`);
  console.log(`Selected tag: ${tags[currentTagIndex]}`);

}
