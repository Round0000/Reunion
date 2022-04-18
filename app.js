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

function displayCalendar(data) {
  const list = document.createElement("ul");

  function addMonthTitle(date) {
    const newMonthTitle = document.createElement("h4");
    newMonthTitle.innerText = getMonthName(date) + " " + date.getFullYear();
    newMonthTitle.classList.add("month_title");
    newMonthTitle.id = newMonthTitle.innerText.replace(" ", "_");
    list.append(newMonthTitle);

    const newNavMonth = document.createElement("li");
    newNavMonth.innerHTML = `<a href="#${newMonthTitle.id}">${newMonthTitle.innerText}</a>`;
    ui_menuList.append(newNavMonth);
  }

  const baseDates = Object.keys(data.period);

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
    newItem.classList.add("date_item");
    newItem.dataset.day = getDayName(date);
    newItem.dataset.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    newItem.innerHTML = `
      <div class="date_item_header">
      <span class="date_number">${date.getDate()}</span>
        <span class="date_day">${getDayName(date)}</span>
      </div>
      <div class="date_options">
        <div>
          <input type="checkbox"" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_opt1">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_opt1">Matin</label>
        </div>
        <div>
          <input type="checkbox"" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_opt2">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_opt2">Aprem</label>
        </div>
        <div>
          <input type="checkbox"" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_opt3">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_opt3">Soir</label>
        </div>
      </div>
    `;

    list.append(newItem);
  });

  ui_sectionEditNewCalendar.innerHTML = "";
  ui_sectionEditNewCalendar.append(list);
}

document.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    console.log(e.target.dataset.date);
  }
});

// UI elements
const ui_sectionCreateNewCalendar = document.getElementById(
  "section_createNewCalendar"
);
const ui_sectionEditNewCalendar = document.querySelector(
  "#section_editNewCalendar .container:not(header .container)"
);
const ui_initialForm = section_createNewCalendar.querySelector("form");
const ui_addAnotherOption = add_new_option;
const ui_initialFormOptions = section_createNewCalendar.querySelector(
  ".form_options .form_box div"
);
const ui_menuToggler = document.getElementById("menu_toggler");
const ui_menuList = document.querySelector("#menu ul");

//

ui_menuToggler.addEventListener("click", (e) => {});

ui_initialForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    title: e.target.title.value || "Nouvel agenda",
    start: e.target.start.value,
    end: e.target.end.value,
    options: [],
  };

  e.target.querySelectorAll(".form_options input").forEach((el) => {
    data.options.push(el.value);
  });

  initNewCalendar(data);
});

ui_addAnotherOption.addEventListener("click", (e) => {
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.placeholder = "ex.: 10h30, matin...";
  ui_initialFormOptions.append(newInput);
});

function transitionTo(el) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
  });
  el.classList.remove("hidden");
}

function initNewCalendar(data) {
  console.log(data);
  const now = new Date();
  data.id = `${data.title
    .replaceAll(" ", "")
    .slice(0, 5)
    .toUpperCase()}${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  data.period = getCalendarData(data.start, data.end);
  displayCalendar(data);
  transitionTo(section_editNewCalendar);
}

//

// ui_initialForm.querySelector('button[type="submit"]').click();
