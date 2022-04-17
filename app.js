const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const selectYear = document.getElementById("year");
const selectMonth = document.getElementById("month");

let postToday = false;

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const days = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

function getCalendar(month, year) {
  const arr = [];

  const ui_month = document.createElement("h2");
  ui_month.innerText = `${months[month]} ${year}`;
  ui_month.classList.add("month-title");
  ui_month.id = `${months[month]}-${year}`;

  months_nav.innerHTML += `<li><a href="#${ui_month.id}">${months[month]} ${year}</li>`;

  ui_calendar.append(ui_month);

  let firstDay = new Date(year, month).getDay();

  function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    let currDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let j = 0; j < 7; j++) {
      if (date > daysInMonth(month, year)) {
        break;
      } else {
        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          postToday = true;
        }

        if (postToday) {
          ui_day = document.createElement("li");
          ui_day.dataset.date = `${year}-${month + 1}-${date}`;
          ui_day.dataset.dayofweek = days[currDay];

          arr.push({
            date: `${year}-${month + 1}-${date}`,
            dayofweek: days[currDay],
          });
        }

        if (currDay === 6) {
          currDay = 0;
        } else {
          currDay++;
        }

        date++;
      }
    }
  }

  return arr;
}

console.log(getCalendar(currentMonth, currentYear));

function next() {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  getCalendar(currentMonth, currentYear);
  console.log(getCalendar(currentMonth, currentYear));
}

function previous() {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  getCalendar(currentMonth, currentYear);
  console.log(getCalendar(currentMonth, currentYear));
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  getCalendar(currentMonth, currentYear);
}
//

// ui_day.innerHTML = `
//           <span>${date}</span>
//           <span>${days[currDay]}</span>

//           <div class="options">
//             <label><input name="${ui_day.dataset.date}" data-time="matin" type="checkbox">Matin</label>
//             <label><input name="${ui_day.dataset.date}" data-time="aprem" type="checkbox">Aprèm</label>
//             <label><input name="${ui_day.dataset.date}" data-time="soir" type="checkbox">Soir</label>
//           </div>
//         `;

// ui_calendar.append(ui_day);

//



// showCalendar(currentMonth, currentYear);
// calendArray = getCalendar(currentMonth, currentYear);

// next();

btn_prev.addEventListener("click", (e) => {
  e.preventDefault();

  previous();
});
btn_next.addEventListener("click", (e) => {
  e.preventDefault();

  next();
});

// Form validation
function formData2obj(fd) {
  const obj = {};
  for (key of fd.keys()) {
    obj[key] = fd.get(key);
  }
  return obj;
}

creation_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = formData2obj(new FormData(e.target));

  const selection = {};

  const selectedDates = Object.keys(data);

  selectedDates.forEach((date) => {
    const dateEl = document.querySelector(`[data-date="${date}"]`);

    const selectedTimes = dateEl.querySelectorAll("input:checked");
    selection[dateEl.dataset.date] = [];

    selectedTimes.forEach((input) => {
      selection[dateEl.dataset.date].push(input.dataset.time);
    });
  });

  console.log(selection);
  console.table(selection);

  Object.keys(selection).forEach((date) => {
    const newOption = document.createElement("li");
    newOption.innerText = date;
    response_list.append(newOption);
  });
});

//
