let currentCalendar;

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
  const list = document.querySelector("#newCalendarForm_list");

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
        <span class="date_month">${getMonthName(date)}</span>
        <span class="date_day">${getDayName(date)}</span>
      </div>
      <div class="date_options">
        <div>
          <input type="checkbox" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_0">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_0">Matin</label>
        </div>
        <div>
          <input type="checkbox" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_1">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_1">Aprem</label>
        </div>
        <div>
          <input type="checkbox" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_2">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_2">Soir</label>
        </div>
      </div>
    `;

    list.append(newItem);
  });
}

// UI elements
const ui_sectionCreateNewCalendar = document.getElementById(
  "section_createNewCalendar"
);
const ui_newCalendarForm = document.querySelector("#newCalendarForm");
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
  
  currentCalendar = data;

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

// Submit New Calendar
function submitNewCalendar(selection) {
  console.log(selection);
}

ui_newCalendarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const checkedOptions = e.target.querySelectorAll(".date_item input:checked");
  const selection = [];

  checkedOptions.forEach((option) => {
    const obj = {
      date: option.closest(".date_item").dataset.date,
      options: [],
    };
    obj.options.push(option.id.split("_")[3]);

    selection.push(obj);
  });

  submitNewCalendar(selection);
});

// Check/Uncheck All options
action_checkAll.addEventListener('click', e => {
  document.querySelectorAll('.date_item input').forEach(inp => {
    inp.checked = true;
  })
})
action_uncheckAll.addEventListener('click', e => {
  document.querySelectorAll('.date_item input').forEach(inp => {
    inp.checked = false;
  })
})

//

ui_initialForm.querySelector('button[type="submit"]').click();
