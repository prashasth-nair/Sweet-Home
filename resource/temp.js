var Bookmark_dialoge = document.querySelector(".Bookmark_window");

// const Bookmark_close = document.querySelector('#bookmark_close');
const bookmark_button = document.querySelector("#add_bookmark");
const bookmark_save = document.querySelector("#bookmark_save");
const bookmark_name_box = document.querySelector("#name_box");
const bookmark_url_box = document.querySelector("#url_box");
const icon = document.querySelector(".icon-field");

var Bookmark_delete_dialoge = document.querySelector(".delete_bookmark_dialog");

// var columnGrids = [];

let drag = false;


// document.getElementById('open_in_new_tab').addEventListener('click', (e) => {

//     window.open("https://www."+element_id);
// });





// Bookmark








// delete one bookmark - Testing(Remove later)
// var json = JSON.parse(localStorage.getItem("bookmarks"));
// let json_delete = json.filter((json) => json.url !== "https://www.youtube.com");
// bookmark_grid.remove(bookmark_grid.getItems(0), { removeElements: true });
// localStorage.removeItem("bookmarks", JSON.stringify(json_delete));

// bookmark_url_box.addEventListener("keydown", (e) => {
//   if (bookmark_url_box.value.includes(".")) {
//     icon.style.background =
//       "url(https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://" +
//       bookmark_url_box.value +
//       "&size=128)  no-repeat";
//     icon.style.backgroundSize = "100% 100%";
//   }
// });

// function closeDialog() {
//   // Clear the text field
//   document.getElementById("name_box").value = "";
//   document.getElementById("url_box").value = "";
//   // Hide the dialog
//   Bookmark_dialoge.close();
// }
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

