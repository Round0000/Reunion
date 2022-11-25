let currentCalendar = {};
let currentMember;

linkHome.href = window.location.origin;

// Initial period input values
let startDate = new Date();
function getInputDateFormat(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
function setMaxEndDate(startDate) {
  let maxDate = new Date(startDate);
  if (maxDate.getDate() > 28) {
    maxDate.setDate(28);
  }

  new_end.setAttribute(
    "max",
    getInputDateFormat(new Date(maxDate.setMonth(maxDate.getMonth() + 5)))
  );
  new_end.setAttribute("min", getInputDateFormat(new Date(startDate)));
}
setMaxEndDate(startDate);
new_start.value = getInputDateFormat(startDate);
new_start.addEventListener("change", (e) => {
  startDate = new Date(new_start.value);
  setMaxEndDate(startDate);
});

//

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
  return date.toLocaleDateString(locale, { weekday: "long" }) || "wesh";
}
function getMonthName(date = new Date(), locale = "fr-FR") {
  return date.toLocaleDateString(locale, { month: "long" });
}
function formatDate(str) {
  const date = new Date(str);
  // const formattedDate = date.toLocaleString().split(",")[0];

  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  return formattedDate;
}

//
function convertDateForIos(date) {
  date = date += " 00:00:00";
  var arr = date.split(/[- :]/);
  date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  return date;
}
//

function displayCalendar(data, mode) {
  ui_body.dataset.mode = mode;

  if (mode === "edit") {
    if (localDB[1].members.length === 0) {
      displayMode_toggler.classList.add("hidden");
    } else {
      localDB[1].members.forEach((member) => {
        // Add button to menu for existing users
        const btn = document.createElement('button');
        btn.innerText = member.name;
        btn.href = '#'
        btn.addEventListener('click', e => {
          if (
            !window.confirm(
              `En poursuivant, vous allez éditer les disponibilités de l'utilisateur existant : ${member.name}.`
            )
          ) return;
          document.querySelectorAll(".date_item input").forEach((inp) => {
            if (inp.disabled) return;
            inp.checked = false;
            inp.dataset.state = "null";
          });
          member.selection.forEach((item) => {
            item.options.forEach((el) => {
              const checkbox = ui_calendarForm.querySelector(
                `input[data-id="${item.date.replaceAll("-", "_")}_${el.option}"]`
              );
              checkbox.checked = true;
              checkbox.dataset.state = el.state;
            });
          });

          currentMember = member;
          username_input.value = member.name;
          username_input.disabled = true;
        })
        existing_members.append(btn);
      });
    }
  }

  if (mode === "admin") {
    displayMode_toggler.classList.add("hidden");
    editMode_toggler.classList.add("hidden");
  }

  const list = document.querySelector("#calendarForm_list");
  list.innerHTML = "";

  ui_menuList.innerHTML = "";

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
      baseDates.push(convertDateForIos(d.date));
    });
  }

  baseDates.forEach((date, index) => {
    const prev = new Date(baseDates[index - 1]).getMonth() + 1;
    const curr = new Date(baseDates[index]).getMonth() + 1;

    date = new Date(date);

    if ((prev && curr && prev !== curr) || index === 0) {
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
    `;

    if (mode === "admin" || mode === "edit") {
      const optionsBox = document.createElement("DIV");
      optionsBox.classList.add("date_options");

      for (i = 0; i < data.options.length; i++) {
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.dataset.state = "null";

        if (mode === "edit") {
          const optionAllowed = data.selection[index].options.find(
            (opt) => opt.option === i
          );
          if (!optionAllowed) {
            input.disabled = true;
          }
        }

        input.dataset.id = `${newItem.dataset.date.replaceAll("-", "_")}_${i}`;
        input.id = `input_${newItem.dataset.date.replaceAll("-", "_")}_${i}`;
        const label = document.createElement("label");
        label.setAttribute("for", "input_" + input.dataset.id);
        label.innerText = data.options[i] || "test";
        div.append(input, label);
        optionsBox.append(div);
      }

      newItem.append(optionsBox);
    } else if (mode === "display") {
      const spots = document.createElement("ul");
      spots.classList.add("display_spots");
      data.selection[index].options.forEach((item, optIndex) => {
        const spot = document.createElement("li");
        const members_yes = data.selection[index].options[optIndex].members_yes;
        const members_maybe =
          data.selection[index].options[optIndex].members_maybe;
        const members_total = [...members_yes, ...members_maybe];
        const members_no = [];
        data.members.forEach((member) => {
          if (!members_total.find((el) => el === member.name)) {
            members_no.push(member.name);
          }
        });
        spot.innerHTML = `
        <div class="spot_title">${data.options[item.option]}</div>
        <div class="spot_no" title="Non disponibles"><img src="./img/no.svg" alt="Non disponibles"> ${
          members_no.length
        }
        <ul class="spot_tooltip"></ul></div>
        <div class="spot_maybe" title="Participations éventuelles"><img src="./img/maybe.svg" alt="Participations éventuelles"> ${
          members_maybe.length
        }
        <ul class="spot_tooltip"></ul>
        </div>
        <div class="spot_yes" title="Participations assurées"><img src="./img/check.svg" alt="Participations assurées"> ${
          members_yes.length
        }
        <ul class="spot_tooltip"></ul>
        </div>
        <div class="spot_total" title="Total des participations possibles"><img src="./img/total.svg" alt="Total des participations possibles"> ${
          members_total.length
        }
        <ul class="spot_tooltip"></ul>
        </div>
        `;
        const spotNoTip = spot.querySelector(".spot_no .spot_tooltip");
        const spotMaybeTip = spot.querySelector(".spot_maybe .spot_tooltip");
        const spotYesTip = spot.querySelector(".spot_yes .spot_tooltip");
        const spotTotalTip = spot.querySelector(".spot_total .spot_tooltip");
        members_no.forEach((member) => {
          const memberItem = document.createElement("li");
          memberItem.innerText = member;
          spotNoTip.append(memberItem);
        });
        members_maybe.forEach((member) => {
          const memberItem = document.createElement("li");
          memberItem.innerText = member;
          spotMaybeTip.append(memberItem);
        });
        members_yes.forEach((member) => {
          const memberItem = document.createElement("li");
          memberItem.innerText = member;
          spotYesTip.append(memberItem);
        });
        members_total.forEach((member) => {
          const memberItem = document.createElement("li");
          memberItem.innerText = member;
          spotTotalTip.append(memberItem);
        });

        spots.append(spot);
      });
      newItem.append(spots);
    }

    list.append(newItem);
  });

  if (mode === "display") {
    const allTotals = [];
    calendarForm_list.querySelectorAll(".spot_total").forEach((item) => {
      allTotals.push(parseInt(item.innerText));
    });

    setMaxTotal(allTotals);
  }
}

// UI elements
const ui_body = document.body;

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

function generateRandomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    alphabet[Math.floor(Math.random() * alphabet.length)] +
    alphabet[Math.floor(Math.random() * alphabet.length)] +
    alphabet[Math.floor(Math.random() * alphabet.length)]
  );
}

function initNewCalendar(data, mode) {
  header_icon.classList.add("hidden");
  ui_menuToggler.classList.remove("hidden");

  currentCalendar = data;

  ui_body.dataset.mode = mode;

  if (mode === "admin") {
    const now = new Date();

    data.id = `_REU${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}${generateRandomLetter()}`;
    data.period = getCalendarData(data.start, data.end);
  }

  public_form_title.innerText = data.title;
  public_form_period.innerText = `Du ${formatDate(data.start)} au ${formatDate(
    data.end
  )}`;

  displayCalendar(data, mode);

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

  if (mode === "admin") {
    storeBaseCal(finalCal);
  } else if (mode === "edit") {
    if (currentMember) {
      updateMemberCal({
        selection: selection,
        name: currentMember.name,
      });
    } else {
      storeMemberCal({
        selection: selection,
        name: username_input.value.trim(),
      });
    }
  }

  transitionTo(section_newCalendarCheckout);
  displayCheckout(finalCal, mode);
}

//
calendarForm_actions
  .querySelector('button[type="submit"]')
  .addEventListener("click", (e) => {
    if (ui_body.dataset.mode === "edit" && username_input.value.length === 0) {
      username_input.required = true;
      username_input.focus();
      public_form_details.scrollIntoView();
    }
  });

ui_calendarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const mode = ui_body.dataset.mode;

  const dates = e.target.querySelectorAll(".date_item");
  const selection = [];

  dates.forEach((item) => {
    if (item.querySelector("input:checked")) {
      const obj = {
        options: [],
      };
      obj.date = item.dataset.date;

      item.querySelectorAll("input:checked").forEach((el) => {
        if (mode === "admin") {
          obj.options.push({
            option: parseInt(el.dataset.id.split("_")[3]),
            members_yes: [],
            members_maybe: [],
          });
        } else if (mode === "edit") {
          obj.options.push({
            option: parseInt(el.dataset.id.split("_")[3]),
            state: el.dataset.state,
          });
        }
      });

      selection.push(obj);
    }
  });

  if (selection.length === 0) {
    alert("Vous n'avez coché aucun créneau.");
  } else {
    submitNewCalendar(currentCalendar, selection, mode);
  }
});

// Display checkout
function displayCheckout(data, mode) {
  checkout_title.innerText = data.title;
  checkout_period.innerText = `Du ${formatDate(data.start)} au ${formatDate(
    data.end
  )}`;
  checkout_link.innerText = "Voir le calendrier";
  checkout_link.href = `${window.location.origin}?${data.id}`;

  if (mode === "edit") {
    checkout_instructions.innerText = `Merci ${username_input.value.trim()} pour votre participation !
    Pour revenir à l'édition du calendrier et voir les résultats, suivez le lien ci-dessous.`;
    checkout_copy.classList.add("hidden");
  } else {
    checkout_copy.classList.remove("hidden");
  }

  header_icon.classList.remove("hidden");
  ui_menuToggler.classList.add("hidden");
}

// Check/Uncheck All options
document.addEventListener("click", (e) => {
  if (e.target.matches("#action_checkAll")) {
    document.querySelectorAll(".date_item input").forEach((inp) => {
      if (inp.disabled) return;
      inp.checked = true;
      inp.dataset.state = "checked";
    });
  } else if (e.target.matches("#action_uncheckAll")) {
    document.querySelectorAll(".date_item input").forEach((inp) => {
      if (inp.disabled) return;
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
      ui_body.dataset.mode === "edit"
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
  window.innerHeight -
  parseInt(window.getComputedStyle(header).height.split("px")[0]) +
  "px";

ui_menuToggler.addEventListener("click", (e) => {
  menu.classList.toggle("menu-visible");
});
menu.addEventListener("click", (e) => {
  if (e.target.matches("a") || e.target.matches("#menu button")) {
    menu.classList.remove("menu-visible");
  }
});

displayMode_toggler.addEventListener("click", (e) => {
  initDisplayMode(currentCalendar);
});
editMode_toggler.addEventListener("click", (e) => {
  window.location.reload();
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

// Display mode

function setMaxTotal(data) {
  display_filter_total.setAttribute("max", Math.max(...data));
}

display_filter_total.addEventListener("change", (e) => {
  document.querySelectorAll(".spot_total").forEach((item) => {
    if (parseInt(item.innerText) >= e.target.value) {
      item.parentElement.classList.remove("hidden");
    } else {
      item.parentElement.classList.add("hidden");
    }
  });

  document.querySelectorAll(".date_item").forEach((item) => {
    if (item.querySelector(".display_spots > li:not(.hidden)")) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});
