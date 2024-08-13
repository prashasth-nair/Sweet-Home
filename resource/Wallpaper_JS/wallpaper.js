const Wallpaper_dialoge = document.querySelector(".Wallpaper_window");
const grid = document.querySelector(".grid");
const Wallpaper_upload = document.querySelector(".wallpaper_upload");
const Wallpaper_close = document.querySelector("#close");
const wallpaper_button = document.querySelector("#wallpaper");
const Wallpaper_upload_button = document.querySelector(
  "#Wallpaper_user_upload"
);
const Wallpaper_Home_button = document.querySelector("#Wallpaper_Home");

const genre = document.querySelector(".genre");

const Wallpaper_header = document.querySelector(".wallpaper_header");
const Wallpaper_footer = document.querySelector(".footer");

var is_loading = false;
var wallpaper_lis = [];

var bgimage = localStorage.getItem("wallpaper_img");
let is_home = true;
if (is_home) {
  Wallpaper_Home_button.style.color = "#42a5f5";
  Wallpaper_upload_button.style.color = "white";
} else {
  Wallpaper_upload_button.style.color = "#42a5f5";
  Wallpaper_Home_button.style.color = "white";
}
// default wallpaper
if (bgimage != null) {
  document.body.style.backgroundImage = "url(" + bgimage + ")";
} else {
  document.body.style.backgroundImage = "url('wallpapers/Wallpaper.jpg')";
}

function removeAllElements() {
  // Get the div element by its ID
  var myDiv = document.getElementById("imageContainer");
  wallpaper_lis.length = 0;
  // Clear the content of the div by setting innerHTML to an empty string
  myDiv.innerHTML = "";
}

function getImageURLs(page) {
  return new Promise((resolve, reject) => {
    fetch(`https://sweet-home-backend.onrender.com/api/image/list?page=${page}`) 
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          wallpaper_lis.push(data[i].download_url);
        }
        console.log(wallpaper_lis);
        resolve();
      })
      .catch(reject);
  });
}

// Generate random image URLs
function loadImages(page=1) {
  showLoading();
  is_loading = true;
  let promises = [];

  promises.push(getImageURLs(page));

  // Wait for all promises to be resolved
  Promise.all(promises)
    .then(() => {
      // Now check the length of the array

      loadAndArrangeImages();
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
    });
}
// Function to load and arrange images using Masonry
function loadAndArrangeImages() {
  const imageContainer = document.getElementById("imageContainer");
  console.log(wallpaper_lis);

  wallpaper_lis.forEach((url) => {
    const img = new Image();
    img.src = url;
    img.classList.add("grid-item");

    imageContainer.appendChild(img);
  });
  hideLoading();
  is_loading = false;
  // Use imagesLoaded to ensure all images are loaded before initializing Masonry
  imagesLoaded(imageContainer, function () {
    // Initialize Masonry
    const masonry = new Masonry(".grid", {
      itemSelector: "grid-item",
      columnWidth: 200, // Adjust as needed
      gutter: 10, // Adjust as needed
      fitWidth: true,
    });
  });
}

function showLoading() {
  document.getElementById("loader").style.display = "block";
}

function hideLoading() {
  document.getElementById("loader").style.display = "none";
}

function Show_home() {
  grid.style.display = "grid";
  genre.style.display = "flex";

  Wallpaper_upload.style.display = "none";

  Wallpaper_Home_button.style.color = "#42a5f5";
  Wallpaper_upload_button.style.color = "white";
}
document.getElementById("imageContainer").addEventListener("click", (e) => {
  var bgimage = e.target.src;
  if (bgimage) {
    document.body.style.backgroundImage = "url(" + bgimage + ")";
    localStorage.setItem("wallpaper_img", bgimage);
    console.log("id", bgimage);
  }
  console.log(e.target.src);
});

wallpaper_button.addEventListener("click", () => {
  wallpaper_lis.length = 0;
  removeAllElements();
  Show_home();
  loadImages();
  Wallpaper_dialoge.showModal();
});
Wallpaper_close.addEventListener("click", () => {
  Wallpaper_dialoge.close();
  removeAllElements();
});



Wallpaper_upload_button.addEventListener("click", () => {
  grid.style.display = "none";
  genre.style.display = "none";
  hideLoading();
  Wallpaper_upload.style.display = "block";
  

  Wallpaper_upload_button.style.color = "#42a5f5";
  Wallpaper_Home_button.style.color = "white";
});

Wallpaper_Home_button.addEventListener("click", () => {
  Show_home();
});



function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      document
        .getElementById("Display_img")
        .setAttribute("src", e.target.result);
    };
    console.log(input.files[0]);

    reader.readAsDataURL(input.files[0]);
  }
}


function isAtBottom() {
  return (
    Wallpaper_dialoge.scrollTop + Wallpaper_dialoge.clientHeight >=
    Wallpaper_dialoge.scrollHeight
  );
}
let page = 1;
// Event listener for scroll
Wallpaper_dialoge.addEventListener("scroll", () => {
  if (isAtBottom() && Wallpaper_upload.style.display == "none") {
    page++;
    wallpaper_lis.length = 0;
    loadImages(page);
  }
});
