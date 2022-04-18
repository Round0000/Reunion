function getDaysArray(start, end) {
  const arr = [];
  for (
    dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
}

function getCalendarData(start, end) {
  const calendar = {};

  getDaysArray(start, end).forEach((date) => {
    calendar[date] = {
      matin: null,
      aprem: null,
      soir: null,
    };
  });

  return calendar;
}

function getDayName(date = new Date(), locale = "fr-FR") {
  return date.toLocaleDateString(locale, { weekday: "long" });
}
function getMonthName(date = new Date(), locale = "fr-FR") {
  return date.toLocaleDateString(locale, { month: "long" });
}

//

function displayCalendar(period) {
  const list = document.createElement("ul");

  function addMonthTitle(date) {
    const newMonthTitle = document.createElement("h2");
    newMonthTitle.innerText = getMonthName(date) + " " + date.getFullYear();
    newMonthTitle.classList.add("month_title");
    list.append(newMonthTitle);
  }

  const baseDates = Object.keys(period);

  console.log(baseDates);

  baseDates.forEach((date) => {
    date = new Date(date);

    if (
      date.getDate() === 1 ||
      (date.getDate() === new Date(baseDates[0]).getDate() &&
        date.getMonth() === new Date(baseDates[0]).getMonth() &&
        date.getFullYear() === new Date(baseDates[0]).getFullYear())
    ) {
      addMonthTitle(date);
    }

    const newItem = document.createElement("li");
    newItem.dataset.day = getDayName(date);
    newItem.dataset.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    newItem.innerText = date.getDate() + " " + getDayName(date);

    list.append(newItem);
  });

  section_editNewCalendar.innerHTML = "";
  section_editNewCalendar.append(list);
}

document.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    console.log(e.target.dataset.date);
  }
});

ui_initialForm = section_createNewCalendar.querySelector("form");
ui_addAnotherOption = add_new_option;
ui_initialFormOptions = section_createNewCalendar.querySelector(
  ".form_options .form_box div"
);

ui_initialForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const base = getCalendarData(e.target.start.value, e.target.end.value);

  displayCalendar(base);
});

ui_addAnotherOption.addEventListener("click", (e) => {
  ui_initialFormOptions.innerHTML += `<input type="text" placeholder="ex.: 10h30, matin..." />`;
});
