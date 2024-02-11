var Bookmark_dialoge = document.querySelector('.Bookmark_window');

// const Bookmark_close = document.querySelector('#bookmark_close');
const bookmark_button = document.querySelector('#add_bookmark');
const bookmark_save = document.querySelector('#bookmark_save');
const bookmark_name_box = document.querySelector('#name_box');
const bookmark_url_box = document.querySelector('#url_box');
const icon = document.querySelector(".icon-field");

var Bookmark_delete_dialoge = document.querySelector('.delete_bookmark_dialog');

var columnGrids = [];

let drag = false;

// const grid = new Muuri(".grid", {
//     dragEnabled: true,
//     layout: {
//         fillGaps: true,
//         horizontal: false,
//         alignRight: false,
//         alignBottom: false,
//         rounding: true,
//     },
// });

// document.getElementById('open_in_new_tab').addEventListener('click', (e) => {

//     window.open("https://www."+element_id);
// });


// Bookmark
// Inserting bookmarks in grid from storage
if (localStorage.getItem('bookmarks') != null) {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    for (var i = 0; i < bookmarks.length; i++) {
        var website_name = bookmarks[i].name;
        var website_url = bookmarks[i].url;

        var item = document.createElement('div');
        item.setAttribute('class', 'item');


        var item_content = document.createElement('div');
        item_content.setAttribute('class', 'item-content');
        item_content.setAttribute('style', 'background:url(https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://' + website_url + '&size=128)  no-repeat; background-size:100% 100%');
        item_content.setAttribute('id', website_url);

        item.appendChild(item_content);
        var label = document.createElement('label');
        label.innerHTML = [website_name];
        item_content.appendChild(label);
        // grid.add(item)
    }
}

// Right click event
//Events for desktop and touch
let events = ["contextmenu", "touchstart"];
//initial declaration
var timeout;
//for double tap
var lastTap = 0;
//refer menu div
let contextMenu = document.getElementById("context-menu");
var element_id = null;


// for double tap(works on touch devices)
document.addEventListener("touchend", function (e) {
    //current time
    var currentTime = new Date().getTime();
    //gap between two gaps
    var tapLength = currentTime - lastTap;
    //clear previous timeouts(if any)
    clearTimeout(timeout);
    //if user taps twice in 500ms
    if (tapLength < 500 && tapLength > 0) {
        //hide menu
        contextMenu.style.visibility = "hidden";
        e.preventDefault();
    } else {
        //timeout if user doesn't tap after 500ms
        timeout = setTimeout(function () {
            clearTimeout(timeout);
        }, 500);
    }
    //lastTap set to current time
    lastTap = currentTime;
});

//click outside the menu to close it (for click devices)
// document.addEventListener("click", function (e) {
//     if (!contextMenu.contains(e.target)) {
//         contextMenu.style.visibility = "hidden";
//     }else{
//         contextMenu.style.visibility = "visible";
//     }
// });

// same function for both events
if (localStorage.getItem('bookmarks') != null) {
    document.getElementById('bookmark_grid').addEventListener('contextmenu', (e) => {
        if (e.target.id != 'bookmark_grid') {
            e.preventDefault();
            element_id = e.target.id;
            //x and y position of mouse or touch
            let mouseX = e.clientX || e.touches[0].clientX;
            let mouseY = e.clientY || e.touches[0].clientY;
            //height and width of menu
            let menuHeight = contextMenu.getBoundingClientRect().height;
            let menuWidth = contextMenu.getBoundingClientRect().width;
            //width and height of screen
            let width = window.innerWidth;
            let height = window.innerHeight;
            //If user clicks/touches near right corner
            if (width - mouseX <= 200) {
                contextMenu.style.borderRadius = "5px 0 5px 5px";
                contextMenu.style.left = width - menuWidth + "px";
                contextMenu.style.top = mouseY + "px";
                //right bottom
                if (height - mouseY <= 200) {
                    contextMenu.style.top = mouseY - menuHeight + "px";
                    contextMenu.style.borderRadius = "5px 5px 0 5px";
                }
            }
            //left
            else {
                contextMenu.style.borderRadius = "0 5px 5px 5px";
                contextMenu.style.left = mouseX + "px";
                contextMenu.style.top = mouseY + "px";
                //left bottom
                if (height - mouseY <= 200) {
                    contextMenu.style.top = mouseY - menuHeight + "px";
                    contextMenu.style.borderRadius = "5px 5px 5px 0";
                }
            }
            //display the menu
            contextMenu.style.visibility = "visible";

        }
    },
        { passive: false }
    );


}

// Delete bookmark
// document.getElementById('delete_bookmark').addEventListener('click', (e) => {
//     if (contextMenu.style.visibility == "visible") {
//         contextMenu.style.visibility = "hidden";
//     }
    

//     var json = JSON.parse(localStorage.getItem('bookmarks'));
//     var index = json.findIndex(json => json.url == element_id);

//     if (index == -1) {
//         alert("Bookmark not found in JSON array");
//         return;
//     }

//     var item = document.createElement('div');
//     item.setAttribute('id', 'delete_text');
//     var label = document.createElement('label');
//     label.innerHTML = ["Are you sure you want to delete " + json[index]['name'] + " bookmark?"];
//     item.appendChild(label);
//     Bookmark_delete_dialoge.appendChild(item);
//     Bookmark_delete_dialoge.show();

//     document.getElementById('delete_close').addEventListener('click', () => {
//         Bookmark_delete_dialoge.close();
//     })
//     document.getElementById('delete_cancel').addEventListener('click', () => {
//         Bookmark_delete_dialoge.close();
//     })
//     document.getElementById('delete_confirm').addEventListener('click', () => {
//         document.getElementById(element_id).remove();

//         let json_delete = json.filter(json => json.url !== element_id);
//         console.log(element_id);

//         // grid.remove(grid.getItems(index), { removeElements: true });
//         localStorage.setItem('bookmarks', JSON.stringify(json_delete));
//         Bookmark_delete_dialoge.close();
//     })
// });


bookmark_url_box.addEventListener('keydown', (e) => {
    if (bookmark_url_box.value.includes('.')) {

        icon.style.background = "url(https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://" + bookmark_url_box.value + "&size=128)  no-repeat";
        icon.style.backgroundSize = "100% 100%";
    }
})
bookmark_save.addEventListener('click', () => {
    if (bookmark_name_box.value != "" && bookmark_url_box.value != "") {
        var website_name = bookmark_name_box.value;
        var website_url = bookmark_url_box.value;
        var bookmark = {
            name: website_name,
            url: website_url
        }

        // Test if bookmarks is null
        if (localStorage.getItem('bookmarks') === null) {
            // Init array
            var bookmarks = [];
            // Add to array
            bookmarks.push(bookmark);
            // Set to localStorage
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        } else {
            // Get bookmarks from localStorage
            var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
            // Add bookmark to array
            bookmarks.push(bookmark);
            // Re-set back to localStorage
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
        if (!website_url.includes("https://") && !website_url.includes("http://")) {
            website_url = "https://" + website_url;
        }
        var item = document.createElement('div');
        item.setAttribute('class', 'item');


        var item_content = document.createElement('div');
        item_content.setAttribute('class', 'item-content');
        item_content.setAttribute('style', 'background:url(https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://' + bookmark_url_box.value + '&size=128)  no-repeat; background-size:100% 100%');
        item_content.setAttribute('id', website_url);

        item.appendChild(item_content);
        var label = document.createElement('label');
        label.innerHTML = [website_name];
        item_content.appendChild(label);
        // grid.add(item);
        closeDialog();

    }
})

function closeDialog() {
    // Clear the text field
    document.getElementById("name_box").value = "";
    document.getElementById("url_box").value = "";
    // Hide the dialog
    Bookmark_dialoge.close();
  }
// document.getElementById('bookmark_grid').addEventListener(
//     'mousedown', () => drag = false);

// document.getElementById('bookmark_grid').addEventListener(
//     'mousemove', () => drag = true);
// document.getElementById('bookmark_grid').addEventListener('click', (e) => {
//     if (!drag) {
//         var url = e.target.id;
//         if (url != 'bookmark_grid') {
//             if (!url.includes("https://") && !url.includes("http://")) {
//                 url = "https://" + url;
//             }

//             window.open(url, "_self");//opens page
//         }
//     }
// })

bookmark_button.addEventListener("click", () => {

    Bookmark_dialoge.showModal();

});
// Bookmark_close.addEventListener("click", () => {
//     closeDialog();
// });

// End Bookmark