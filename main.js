
// Variables
const settings_dialoge = document.querySelector('.Settings_window');
const Wallpaper_dialoge = document.querySelector('.Wallpaper_window');
const Wallpaper_close = document.querySelector('#close');
const search_box = document.querySelector('#Text');
const settings_button = document.querySelector('#settings');
const wallpaper_button = document.querySelector('#wallpaper');
const settings_cancel_button = document.querySelector('#settings_cancel');
const settings_save_button = document.querySelector('#settings_save');
const quotes = document.querySelector('#quotes');

const General_tab = document.querySelector('#General_tab');
const Search_tab = document.querySelector('#Search_tab');

const General_screen = document.querySelector('.General');
const Search_screen = document.querySelector('.Search');

var new_tab_isChecked = localStorage.getItem('new_tab_isChecked');

var hour_format = localStorage.getItem('hour_format');
var bgimage = localStorage.getItem('wallpaper_img');
if(bgimage!=null){
    document.body.style.backgroundImage = "url(" + bgimage + ")";
}

var url = "https://api.quotable.io/random";

General_tab.style.background = '#dbdbdb';
var wallpaper_lis = ["wallpapers\\Wallpaper.jpg", "wallpapers\\Wallpaper1.jpg", "wallpapers\\Wallpaper2.jpg", "wallpapers\\Wallpaper3.jpg"];
async function addList(loc, n) {
    var elem = document.createElement("img");
    document.getElementById("image_loc").appendChild(elem);
    elem.setAttribute("class", "Images");
    elem.setAttribute("id", "Img" + n);

    elem.src = loc;

}
for (let i = 0; i < wallpaper_lis.length; i++) {
    addList(wallpaper_lis[i], i);
}
document.querySelector("#image_loc").addEventListener('click', (e) => {
    var bgimage= document.getElementById(e.target.id).src;
    document.body.style.backgroundImage = "url(" + bgimage + ")";
    localStorage.setItem("wallpaper_img", bgimage);
})

async function fetchDataAsync(url) {
    const response = await fetch(url);

    const data = await response.json();
    document.getElementById('quotes').innerHTML = "\"" + [data['content']] + "\"" + "<br><br>--" + data['author'];
    console.log(data);
}

fetchDataAsync(url);

if (new_tab_isChecked === 'true') {
    document.getElementById("switch").checked = true;
}
else {
    document.getElementById("switch").checked = false;
}

// Click events
document.getElementById("Search_button").addEventListener("click", Click);
document.getElementById("Text").addEventListener("keyup", suggest);


settings_button.addEventListener("click", () => {
    settings_dialoge.showModal();
});

wallpaper_button.addEventListener("click", () => {

    Wallpaper_dialoge.showModal();

});
settings_cancel_button.addEventListener("click", () => {
    settings_dialoge.close();
});
Wallpaper_close.addEventListener("click", () => {
    Wallpaper_dialoge.close();
});
settings_save_button.addEventListener("click", () => {
    hour_format = document.getElementById('hour').value;
    new_tab_isChecked = document.getElementById('switch').checked;

    localStorage.setItem("hour_format", hour_format);
    localStorage.setItem("new_tab_isChecked", new_tab_isChecked);
    settings_dialoge.close();
    window.location.reload();
})

// General Settings
General_tab.addEventListener("click", () => {
    // Button background
    Search_tab.style.background = null;
    General_tab.style.background = '#dbdbdb';

    // hide show div
    if (General_screen.style.display === 'none') {
        General_screen.style.display = 'block'
    }
    Search_screen.style.display = "none";
})
hour_format = JSON.stringify(hour_format);

if (JSON.parse(hour_format) != null) {
    if (JSON.parse(hour_format) == "12 hour") {
        updateClock_12();
        document.getElementById('hour').selectedIndex = 0;

    }
    else if (JSON.parse(hour_format) == "24 hour") {
        updateClock_24();
        document.getElementById('hour').selectedIndex = 1;
    }
}
else {
    updateClock_12();
}

Search_tab.addEventListener("click", () => {
    General_tab.style.background = null;
    Search_tab.style.background = "#dbdbdb";
    // hide show div
    Search_screen.style.display = 'block'


    General_screen.style.display = "none";
})

updateDate();

// Function to get time
function updateClock_24() {
    var now = new Date(); // current date
    if (now.getMinutes() < 10) {
        time = now.getHours() + ':0' + now.getMinutes();
    }
    else {
        time = now.getHours() + ':' + now.getMinutes();
    }

    // set the content of the element with the ID time to the formatted string
    document.getElementById('time').innerHTML = [time];

    // call this function again in 1000ms
    setTimeout(updateClock_24, 1000);
}

function updateClock_12() {
    var now = new Date(); // current date
    var min, hr;
    if (now.getMinutes() < 10) {
        min = '0' + now.getMinutes()
    }
    else {
        min = now.getMinutes();
    }
    if (now.getHours() > 12) {
        hr = now.getHours() - 12;
        time = hr + ':' + min + " PM";
    }
    else {
        hr = now.getHours();
        time = hr + ':' + min + " AM";
    }

    // set the content of the element with the ID time to the formatted string
    document.getElementById('time').innerHTML = [time];

    // call this function again in 1000ms
    setTimeout(updateClock_12, 1000);
}

function updateDate() {
    var now = new Date(), // current date
        months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        days = ["Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"];
    // you get the idea


    // a cleaner way than string concatenation
    date = [months[now.getMonth()],
    now.getDate()].join(" ");
    day_date = [days[now.getDay()],
        date].join(', ');


    // set the content of the element with the ID time to the formatted string
    document.getElementById('day_date').innerHTML = [day_date];

    // call this function again in 1000ms
    setTimeout(updateDate, 1000);
}

if (performance.navigation.type == performance.navigation.TYPE_BACK_FORWARD) {
    document.getElementById('Text').value = "";
}

document.getElementById('Form').onsubmit = function () {
    // Enter key will search
    // process
    Click()
    return false;
}


async function fetchSearchData(url) {
    const response = await fetch(url);

    const data = await response.json();
    document.querySelector("#list").innerHTML = '';
    var n;
    if (data[1].length > 5) {
        n = 5;
    } else {
        n = data[1].length
    }
    if (data[1].length != 0) {
        for (let i = 0; i < n; i++) {
            renderSuggestionList(data[1][i], i);
        }
    }
    else {
        suggest_hide()
    }
}

document.querySelector("#list").addEventListener('click', (e) => {
    // console.log(e.target.id);
    search_box.value = document.getElementById(e.target.id).innerHTML;
    Click()
})

function renderSuggestionList(element, n) {
    var li = document.createElement('li');
    var ident = 'item' + n;
    li.setAttribute('id', ident);

    document.getElementById("list").appendChild(li);

    li.innerHTML = li.innerHTML + element;
    let lis = document.querySelector('#item' + n);
    console.log(lis);
}
function suggest() {
    document.querySelector("#list").innerHTML = '';

    if (search_box.value.length > 2) {
        var url = "https://amg-ss.ask.com/query?q=" + search_box.value;
        suggest_show();


        fetchSearchData(url)
    }
    else {
        suggest_hide();
    }
}
function suggest_show() {
    document.getElementById('Text').style.borderRadius = '15px 0px 0px 0px';
    document.getElementById('Search_button').style.borderRadius = '0px 15px 0px 0px';
    document.querySelector("#suggestion_list").style.display = 'block';
}
function suggest_hide() {
    document.getElementById('Text').style.borderRadius = '15px 0px 0px 15px';
    document.getElementById('Search_button').style.borderRadius = '0px 15px 15px 0px';
    document.querySelector("#suggestion_list").style.display = 'none';
}

function Click() {
    var query = 'http://google.com/search?q=' + document.getElementById('Text').value;
    if (new_tab_isChecked === 'true') {
        window.open(query);//opens page in new tab
    } else {

        window.open(query, "_self");//opens page in same tab
    }
}
