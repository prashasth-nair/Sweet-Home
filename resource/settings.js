const settings_dialoge = document.querySelector(".Settings_window");
const settings_cancel_button = document.querySelector("#settings_cancel");
const settings_save_button = document.querySelector("#settings_save");
const settings_button = document.querySelector("#settings");
const General_tab = document.querySelector("#General_tab");
const Search_tab = document.querySelector("#Search_tab");

const General_screen = document.querySelector(".General");
const Search_screen = document.querySelector(".Search");
var new_tab_isChecked = localStorage.getItem("new_tab_isChecked");
// Settings
settings_button.addEventListener("click", () => {
  settings_dialoge.showModal();
});

General_tab.style.background = "#dbdbdb";
General_tab.style.color = "black";
if (new_tab_isChecked === "true") {
  document.getElementById("switch").checked = true;
} else {
  document.getElementById("switch").checked = false;
}

// Click events
document.getElementById("Search_button").addEventListener("click", Click);

settings_cancel_button.addEventListener("click", () => {
  settings_dialoge.close();
});

settings_save_button.addEventListener("click", () => {
  hour_format = document.getElementById("hour").value;
  new_tab_isChecked = document.getElementById("switch").checked;

  localStorage.setItem("hour_format", hour_format);
  localStorage.setItem("new_tab_isChecked", new_tab_isChecked);
  settings_dialoge.close();
  window.location.reload();
});

// General Settings
General_tab.addEventListener("click", () => {
  // Button background
  Search_tab.style.background = null;
  Search_tab.style.color = "white";
  General_tab.style.background = "#dbdbdb";
  General_tab.style.color = "black";

  // hide show div
  if (General_screen.style.display === "none") {
    General_screen.style.display = "block";
  }
  Search_screen.style.display = "none";
});
hour_format = JSON.stringify(hour_format);

if (JSON.parse(hour_format) != null) {
  if (JSON.parse(hour_format) == "12 hour") {
    updateClock_12();
    document.getElementById("hour").selectedIndex = 0;
  } else if (JSON.parse(hour_format) == "24 hour") {
    updateClock_24();
    document.getElementById("hour").selectedIndex = 1;
  }
} else {
  updateClock_12();
}


// Search Settings
Search_tab.addEventListener("click", () => {
  General_tab.style.background = null;
  General_tab.style.color = "white";
  Search_tab.style.background = "#dbdbdb";
  Search_tab.style.color = "black";
  // hide show div
  Search_screen.style.display = "block";

  General_screen.style.display = "none";
});
