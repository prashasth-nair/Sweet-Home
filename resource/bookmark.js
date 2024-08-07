var Bookmark_dialoge = document.querySelector(".Bookmark_window");

const Bookmark_close = document.querySelector("#bookmark_close");
const bookmark_button = document.querySelector("#add_bookmark");
const bookmark_save = document.querySelector("#bookmark_save");
const bookmark_name_box = document.querySelector("#name_box");
const bookmark_url_box = document.querySelector("#url_box");
const icon = document.querySelector(".icon-field");
const bookmarks = document.querySelectorAll(".bookmark");
const bookmarkLayout = document.getElementById("bookmark_layout");

var Bookmark_delete_dialoge = document.querySelector(".delete_bookmark_dialog");

// delete one bookmark - Testing(Remove later)

// json_delete = []
// localStorage.setItem("bookmarks", JSON.stringify(json_delete));

// Inserting bookmarks in grid from storage
if (localStorage.getItem("bookmarks") != null) {
  generate_bookmark_block();
}

// Display the bookmark dialoge
bookmark_button.addEventListener("click", () => {
  Bookmark_dialoge.showModal();
});

function idGenerator() {
  // Generate random 4 digit number
  let randomId = Math.floor(1000 + Math.random() * 9000);

  if (localStorage.getItem("bookmarks") != null) {
    var bookmarks_json = JSON.parse(localStorage.getItem("bookmarks"));
    for (var i = 0; i < bookmarks_json.length; i++) {
      if (bookmarks_json[i].id == randomId) {
        randomId = idGenerator();
      }
    }
  }
  return randomId;
}

function generate_bookmark_block() {
  bookmarkLayout.innerHTML = "";
  var bookmarks_json = JSON.parse(localStorage.getItem("bookmarks"));
  for (var i = 0; i < bookmarks_json.length; i++) {
    var item = document.createElement("a");
    item.setAttribute("class", "bookmark");
    item.setAttribute("href", bookmarks_json[i].url);
    item.setAttribute("draggable", "true");
    item.setAttribute("id", bookmarks_json[i].id);

    var item_content = document.createElement("img");
    item_content.setAttribute("class", "item-content");
    item_content.setAttribute("alt", bookmarks_json[i].name);
    item_content.setAttribute(
      "src",
      "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
        bookmarks_json[i].url +
        "&size=128"
    );

    var item_span = document.createElement("span");
    item_span.innerHTML = bookmarks_json[i].name;

    item.appendChild(item_content);
    item.appendChild(item_span);

    // Add event listeners for drag and drop
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);

    bookmarkLayout.appendChild(item);
  }
}

// Bookmark dialog functions
bookmark_save.addEventListener("click", () => {
  if (bookmark_name_box.value != "" && bookmark_url_box.value != "") {
    var website_name = bookmark_name_box.value; // Get website name
    var website_url = bookmark_url_box.value; // Get website url
    var website_id = idGenerator(); // Generate random id
    if (!website_url.includes("https://") && !website_url.includes("http://")) {
      website_url = "https://" + website_url;
    }
    // Create bookmark object
    var bookmark = {
      id: website_id,
      name: website_name,
      url: website_url,
    };

    // Test if bookmarks is null
    if (localStorage.getItem("bookmarks") === null) {
      // Init array
      var bookmarks_json = [];
      // Add to array
      bookmarks_json.push(bookmark);
      // Set to localStorage
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks_json));
    } else {
      // Get bookmarks from localStorage
      var bookmarks_json = JSON.parse(localStorage.getItem("bookmarks"));

      // Add bookmark to array
      bookmarks_json.push(bookmark);

      // Re-set back to localStorage
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks_json));
    }

    generate_bookmark_block();
    closeDialog();
  }
});

bookmarkLayout.addEventListener("dragover", dragOver);
bookmarkLayout.addEventListener("drop", drop);

let draggedItem = null;

function dragStart(e) {
  draggedItem = this;
  setTimeout(() => {
    this.classList.add("dragging");
  }, 0);
}

function dragEnd() {
  this.classList.remove("dragging");
  draggedItem = null;
}

function dragOver(e) {
  e.preventDefault();
  const afterElement = getDragAfterElement(bookmarkLayout, e.clientX);
  if (draggedItem) {
    // Check if draggedItem is not null
    if (afterElement == null) {
      bookmarkLayout.appendChild(draggedItem);
    } else {
      bookmarkLayout.insertBefore(draggedItem, afterElement);
    }
  }
}

function drop(e) {
  e.preventDefault();
  saveBookmarksOrder();
}

function getDragAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".bookmark:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function saveBookmarksOrder() {
  const bookmarks = document.querySelectorAll(".bookmark");
  const bookmarksOrder = Array.from(bookmarks).map((bookmark) => ({
    id: bookmark.getAttribute("id"),
    url: bookmark.getAttribute("href"),
    name: bookmark.querySelector("span").innerText,
  }));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarksOrder));
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
let element_id = null;

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

// click outside the menu to close it (for click devices)
document.addEventListener("click", function (e) {
  if (!contextMenu.contains(e.target)) {
    contextMenu.style.visibility = "hidden";
  } else {
    contextMenu.style.visibility = "visible";
  }
});

// same function for both events
if (localStorage.getItem("bookmarks") != null) {
  document.getElementById("bookmark_layout").addEventListener(
    "contextmenu",
    (e) => {
      if (e.target.id != "bookmark_layout") {
        e.preventDefault();
        element_id = e.target.parentElement.id;
        // console.log(element_id);
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
// Delete bookmark
document.getElementById("delete_bookmark").addEventListener("click", (e) => {
  if (contextMenu.style.visibility == "visible") {
    contextMenu.style.visibility = "hidden";
  }

  var json = JSON.parse(localStorage.getItem("bookmarks"));

  var index = json.findIndex((json) => json.id == element_id);

  if (index == -1) {
    alert("Bookmark not found in JSON array");
    return;
  }

  // Clear any existing content in the dialog
  Bookmark_delete_dialoge.innerHTML = '';

  var item = document.createElement("div");
  item.setAttribute("id", "delete_text");
  var label = document.createElement("label");
  label.innerHTML = "Are you sure you want to delete " + json[index]["name"] + " bookmark?";
  item.appendChild(label);

  // Add buttons to the dialog
  const buttonContainer = document.createElement("div");

  const cancelButton = document.createElement("button");
  cancelButton.id = "delete_cancel";
  cancelButton.classList.add("dbutton");
  cancelButton.innerText = "Cancel";
  buttonContainer.appendChild(cancelButton);

  const confirmButton = document.createElement("button");
  confirmButton.id = "delete_confirm";
  confirmButton.classList.add("dbutton");
  confirmButton.innerText = "Confirm";
  buttonContainer.appendChild(confirmButton);

  item.appendChild(buttonContainer);
  Bookmark_delete_dialoge.appendChild(item);

  Bookmark_delete_dialoge.showModal();

  // Attach event listeners after adding buttons to the DOM

  cancelButton.addEventListener("click", () => {
    Bookmark_delete_dialoge.close();
  });

  confirmButton.addEventListener("click", () => {
    console.log(element_id);
    const element = document.getElementById(element_id);

    if (element) {
      element.remove();
      if (json.id == element_id) {
        console.log("Element found");
      }
      let json_delete = json.filter((json) => json.id !== element_id); // Remove the element from the JSON array if element_id is string
      json_delete = json_delete.filter((json) => json.id !== Number(element_id)); // Remove the element from the JSON array if element_id is number
      console.log(json_delete);

      localStorage.setItem("bookmarks", JSON.stringify(json_delete));

      Bookmark_delete_dialoge.close();
      generate_bookmark_block();
    } else {
      console.error(`Element with id ${element_id} not found`);
    }
  });
});
