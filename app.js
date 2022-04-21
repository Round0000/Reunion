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
  const calendar = [];

  getDaysArray(start, end).forEach((date) => {
    calendar.push(date);
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
  const list = document.querySelector("#calendarForm_list");
  list.innerHTML = "";

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

  const baseDates = [];

  if (data.period) {
    baseDates.push(...data.period);
  }

  if (data.selection) {
    data.selection.forEach((d) => {
      baseDates.push(d.date);
    });
  }

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
          <input type="checkbox" data-state="null" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_0">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_0">Matin</label>
        </div>
        <div>
          <input type="checkbox" data-state="null" id="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_1">
          <label for="${newItem.dataset.date.replaceAll(
            "-",
            "_"
          )}_1">Aprem</label>
        </div>
        <div>
          <input type="checkbox" data-state="null" id="${newItem.dataset.date.replaceAll(
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
const ui_calendarForm = document.querySelector("#calendarForm");
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
  data.id = `_${data.title
    .replaceAll(" ", "")
    .slice(0, 3)
    .toUpperCase()}${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  data.period = getCalendarData(data.start, data.end);
  displayCalendar(data);

  transitionTo(section_calendar);
}

// Submit New Calendar
function submitNewCalendar(cal, selection) {
  const finalCal = {
    id: cal.id,
    start: cal.start,
    end: cal.end,
    title: cal.title,
    selection: selection,
  };

  console.table(finalCal);

  ui_main.dataset.mode = "edit";

  // displayCalendar(finalCal);
  transitionTo(section_newCalendarCheckout);

  displayCheckout(finalCal);
  // createCalendarBin(finalCal);
}

//

ui_calendarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const dates = e.target.querySelectorAll(".date_item");
  const selection = [];

  dates.forEach((item) => {
    if (item.querySelector("input:checked")) {
      const obj = {
        options: [],
      };
      obj.date = item.dataset.date;

      item.querySelectorAll("input:checked").forEach((option) => {
        obj.options.push(parseInt(option.id.split("_")[3]));
      });

      selection.push(obj);
    }
  });

  submitNewCalendar(currentCalendar, selection);
});

// Display checkout
function displayCheckout(data) {
  checkout_title.innerText = data.title;
  checkout_period.innerText = `Du ${data.start} au ${data.end}`;
  checkout_link.innerText = data.id;
  checkout_link.href = "/" + data.id;
}

// Check/Uncheck All options
document.addEventListener("click", (e) => {
  if (e.target.matches("#action_checkAll")) {
    document.querySelectorAll(".date_item input").forEach((inp) => {
      inp.checked = true;
      inp.dataset.state = "checked";
    });
  } else if (e.target.matches("#action_uncheckAll")) {
    document.querySelectorAll(".date_item input").forEach((inp) => {
      inp.checked = false;
      inp.dataset.state = "null";
    });
  }
});

// Checkbox states
document.addEventListener("click", (e) => {
  if (e.target.matches(".date_options input")) {
    if (e.target.dataset.state === "null") {
      e.target.checked = true;
      e.target.dataset.state = "checked";
    } else if (e.target.dataset.state === "checked") {
      e.target.checked = true;
      e.target.dataset.state = "maybe";
    } else {
      e.target.checked = false;
      e.target.dataset.state = "null";
    }
  }
});

//

const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

checkout_copy.addEventListener("click", (e) => {
  copyToClipboard(checkout_link.href);
});

//
//
//
ui_initialForm.querySelector('button[type="submit"]').click();
// setTimeout(() => {
//   calendarForm_actions.querySelector('button[type="submit"]').click();
// }, 300);
