let currentCalendar = {};

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
function formatDate(str) {
  const date = new Date(str);
  const formattedDate = date.toLocaleString().split(",")[0];
  return formattedDate;
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

  baseDates.forEach((date, index) => {
    const prev = new Date(baseDates[index - 1]).getMonth();
    const curr = new Date(baseDates[index]).getMonth();

    date = new Date(date);


    if (
      (prev && curr && prev !== curr) ||
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
          
      </div>
    `;

    const optionsBox = newItem.querySelector(".date_options");

    for (i = 0; i < data.options.length; i++) {
      const div = document.createElement("div");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.state = "null";
      input.id = `${newItem.dataset.date.replaceAll("-", "_")}_${i}`;
      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.innerText = data.options[i] || "test";
      div.append(input, label);
      optionsBox.append(div);
    }

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
    if (el.value.length > 0) {
      data.options.push(el.value);
    }
  });

  if (data.options.length === 0) {
    data.options.push("Test");
  }

  initNewCalendar(data, "admin");
});

ui_addAnotherOption.addEventListener("click", (e) => {
  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.placeholder = "ex.: 10h30, matin...";
  newInput.setAttribute("maxlength", "14");
  ui_initialFormOptions.append(newInput);
});

function transitionTo(el) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
  });
  el.classList.remove("hidden");
}

function initNewCalendar(data, mode) {
  header_icon.classList.add("hidden");
  ui_menuToggler.classList.remove("hidden");

  currentCalendar = data;

  ui_main.dataset.mode = mode;

  if (mode === "admin") {
    const now = new Date();
    data.id = `_${data.title
      .replaceAll(" ", "")
      .slice(0, 3)
      .toUpperCase()}${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    data.period = getCalendarData(data.start, data.end);
  }

  public_form_title.innerText = data.title;
  public_form_period.innerText = `Du ${formatDate(data.start)} au ${formatDate(
    data.end
  )}`;

  displayCalendar(data);

  transitionTo(section_calendar);
}

// Submit New Calendar
function submitNewCalendar(cal, selection, mode) {
  const finalCal = {
    id: cal.id,
    start: cal.start,
    end: cal.end,
    title: cal.title,
    selection: selection,
    options: cal.options,
  };

  console.log(finalCal);

  transitionTo(section_newCalendarCheckout);
  displayCheckout(finalCal, mode);

  storeCal(finalCal);
}

//
calendarForm_actions
  .querySelector('button[type="submit"]')
  .addEventListener("click", (e) => {
    if (
      ui_main.dataset.mode === "public" &&
      username_input.value.length === 0
    ) {
      username_input.required = true;
      username_input.focus();
      public_form_details.scrollIntoView();
    }
  });

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

      item.querySelectorAll("input:checked").forEach((el) => {
        obj.options.push({
          option: parseInt(el.id.split("_")[3]),
          // state: el.dataset.state,
          members_yes: [],
          members_maybe: [],
        });
      });

      selection.push(obj);
    }
  });

  submitNewCalendar(currentCalendar, selection);
});

// Display checkout
function displayCheckout(data) {
  checkout_title.innerText = data.title;
  checkout_period.innerText = `Du ${formatDate(data.start)} au ${formatDate(
    data.end
  )}`;
  checkout_link.innerText = "Voir le calendrier";
  checkout_link.href = "http://127.0.0.1:5500/?" + data.id;
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
    } else if (
      e.target.dataset.state === "checked" &&
      ui_main.dataset.mode === "public"
    ) {
      e.target.checked = true;
      e.target.dataset.state = "maybe";
    } else {
      e.target.checked = false;
      e.target.dataset.state = "null";
    }
  }
});

// Menu
menu.style.maxHeight =
  window.innerHeight +
  parseInt(window.getComputedStyle(header).height.split("px")[0]) +
  "px";

ui_menuToggler.addEventListener("click", (e) => {
  menu.classList.toggle("menu-visible");
});
menu.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    menu.classList.remove("menu-visible");
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
// ui_initialForm.querySelector('button[type="submit"]').click();
//
// setTimeout(() => {
//   calendarForm_actions.querySelector('button[type="submit"]').click();
// }, 300);
