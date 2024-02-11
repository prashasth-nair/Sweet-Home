// Variables

const search_box = document.querySelector("#Text");
const quotes = document.querySelector("#quotes");


var hour_format = localStorage.getItem("hour_format");

var url = "https://api.quotable.io/random";

async function fetchDataAsync(url) {
  const response = await fetch(url);

  const data = await response.json();
  const quotesElement = document.getElementById("quotes");

 // Use textContent instead of innerHTML to prevent XSS
  quotesElement.textContent = '"' + [data["content"]] + '"' + "\n\n--" + data["author"];
}
fetchDataAsync(url);

updateDate();

// Function to get time
function updateClock_24() {
  var now = new Date(); // current date
  if (now.getMinutes() < 10) {
    time = now.getHours() + ":0" + now.getMinutes();
  } else {
    time = now.getHours() + ":" + now.getMinutes();
  }

  // set the content of the element with the ID time to the formatted string
  document.getElementById("time").innerHTML = [time];

  // call this function again in 1000ms
  setTimeout(updateClock_24, 1000);
}

function updateClock_12() {
  var now = new Date(); // current date
  var min, hr;
  if (now.getMinutes() < 10) {
    min = "0" + now.getMinutes();
  } else {
    min = now.getMinutes();
  }
  if (now.getHours() > 12) {
    hr = now.getHours() - 12;
    time = hr + ":" + min + " PM";
  } else {
    hr = now.getHours();
    time = hr + ":" + min + " AM";
  }

  // set the content of the element with the ID time to the formatted string
  document.getElementById("time").innerHTML = [time];

  // call this function again in 1000ms
  setTimeout(updateClock_12, 1000);
}

function updateDate() {
  var now = new Date(), // current date
    months = [
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
    ],
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  // you get the idea

  // a cleaner way than string concatenation
  date = [months[now.getMonth()], now.getDate()].join(" ");
  day_date = [days[now.getDay()], date].join(", ");

  // set the content of the element with the ID time to the formatted string
  document.getElementById("day_date").innerHTML = [day_date];

  // call this function again in 1000ms
  setTimeout(updateDate, 1000);
}

if (performance.navigation.type == performance.navigation.TYPE_BACK_FORWARD) {
  document.getElementById("Text").value = "";
}
// TODO: Enter key
document.getElementById("Form").onsubmit = function () {
  // Enter key will search
  // process
  // Click()
  return false;
};

function suggest_show() {
  document.getElementById("Text").style.borderRadius = "15px 0px 0px 0px";
  document.getElementById("Search_button").style.borderRadius =
    "0px 15px 0px 0px";
  document.querySelector("#suggestion_list").style.display = "block";
}
function suggest_hide() {
  document.getElementById("Text").style.borderRadius = "15px 0px 0px 15px";
  document.getElementById("Search_button").style.borderRadius =
    "0px 15px 15px 0px";
  document.querySelector("#suggestion_list").style.display = "none";
}

function Click() {
  var query =
    "http://google.com/search?q=" + document.getElementById("Text").value;
  if (new_tab_isChecked === "true") {
    window.open(query); //opens page in new tab
  } else {
    window.open(query, "_self"); //opens page in same tab
  }
}
