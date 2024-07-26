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
// Drag and drop functionality

// bookmarks.forEach((bookmark) => {
//   bookmark.addEventListener("dragstart", dragStart);
//   bookmark.addEventListener("dragend", dragEnd);
// });

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
  if (draggedItem) { // Check if draggedItem is not null
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
    const bookmarks = document.querySelectorAll('.bookmark');
    const bookmarksOrder = Array.from(bookmarks).map(bookmark => ({
      id: bookmark.getAttribute('id'),
      url: bookmark.getAttribute('href'),
      name: bookmark.querySelector('span').innerText
    }));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksOrder));
  }
