today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

monthAndYear = document.getElementById("monthAndYear");

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
  ui_date.innerText = `${months[month]} ${year}`;

  let firstDay = new Date(year, month).getDay();

  function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  // clearing all previous cells
  ui_calendar.innerHTML = "";

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    let currDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let j = 0; j < 7; j++) {
      if (date > daysInMonth(month, year)) {
        break;
      } else {
        ui_day = document.createElement("li");
        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          ui_day.classList.add("today");
        } // color today's date

        ui_day.innerHTML = `<span>${date}<span>`;

        ui_day.dataset.date = `${year}-${month + 1}-${date}`;
        ui_day.dataset.dayofweek = days[currDay];
        console.log(new Date(`${year}-${month + 1}-${date}`));

        if (currDay === 6) {
          currDay = 0;
        } else {
          currDay++;
        }

        ui_calendar.append(ui_day);

        date++;
      }
    }

    // tbl.appendChild(row); // appending each row into calendar body.
  }
}

showCalendar(currentMonth, currentYear);

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}

btn_prev.addEventListener("click", (e) => {
  e.preventDefault();

  previous();
});
btn_next.addEventListener("click", (e) => {
  e.preventDefault();

  next();
});
