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

  const list = document.createElement('ul');

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
      date.getDate() === new Date(baseDates[0]).getDate()
    ) {
      addMonthTitle(date);
    }

    const newItem = document.createElement("li");
    newItem.dataset.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    newItem.innerText = date.getDate() + " " + getDayName(date);

    list.append(newItem)
  });

  document.body.append(list);
}

const base = getCalendarData("2022-4-26", "2022-5-9");

displayCalendar(base);

document.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    console.log(e.target.dataset.date);
  }
});
