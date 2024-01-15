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

var current_genre_id = "Space";
var is_loading = false;

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

function readJSONFile(filePath) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error reading JSON file:", error);
    });
}
DATA = {};
// Genre
const filePath = "resource\\CollectionIDs.json"; // Update with the correct path to your JSON file
readJSONFile(filePath).then((data) => {
  // Handle the parsed JSON data
  // console.log(data['Space']['ID']);

  for (const [key, value] of Object.entries(data)) {
    console.log(key);
    const div = document.createElement("div");
    div.classList.add("genre_item");
    // Create a dictionary entry
    DATA[key] = value;
    div.innerHTML = `

      <button id=${key}>${key}</button>
      `;
    genre.appendChild(div);
  }
});
document.getElementById("GenreID").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && !is_loading) {
    document.getElementById(current_genre_id).style.backgroundColor =
      "transparent";
    document.getElementById(current_genre_id).style.color = "wheat";
    var key = e.target.id;
    current_genre_id = key;
    e.target.style.backgroundColor = "wheat";
    e.target.style.color = "black";
    removeAllElements();
    loadImages(DATA[key]["numImagesAvailable"], 20, DATA[key]["ID"]);
  }
});

function removeAllElements() {
  // Get the div element by its ID
  var myDiv = document.getElementById("imageContainer");
  wallpaper_lis.length = 0;
  // Clear the content of the div by setting innerHTML to an empty string
  myDiv.innerHTML = "";
}

// Unsplash API
const numImagesAvailable = 535; //how many photos are total in the collection
const numItemsToGenerate = 40; //how many photos you want to display
const imageWidth = 1920; //image width in pixels
const imageHeight = 1080; //image height in pixels
const collectionID = 4332580; //Space, the collection ID from the original url

var wallpaper_lis = [];

function getImageURLs(randomNumber, collectionID) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://source.unsplash.com/collection/${collectionID}/${imageWidth}x${imageHeight}/?sig=${randomNumber}`
    )
      .then((response) => {
        wallpaper_lis.push(response.url);
        resolve();
      })
      .catch(reject);
  });
}

// Generate random image URLs
function loadImages(
  numImagesAvailable,
  numItemsToGenerate,
  collectionID = 4332580
) {
  showLoading();
  is_loading = true;
  let promises = [];

  for (let i = 0; i < numItemsToGenerate; i++) {
    let randomImageIndex = Math.floor(Math.random() * numImagesAvailable);
    promises.push(getImageURLs(randomImageIndex, collectionID));
  }

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
    // Initialize Masonry
    const masonry = new Masonry(".grid", {
      itemSelector: "grid-item",
      columnWidth: 200, // Adjust as needed
      gutter: 10, // Adjust as needed
      fitWidth: true,
    });
  });
}
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

// Load more images
// Function to check if user has scrolled to the bottom
function isAtBottom() {
  return (
    Wallpaper_dialoge.scrollTop + Wallpaper_dialoge.clientHeight >=
    Wallpaper_dialoge.scrollHeight
  );
}

// Event listener for scroll
Wallpaper_dialoge.addEventListener("scroll", () => {
  if (isAtBottom() && Wallpaper_upload.style.display == "none") {
    wallpaper_lis.length = 0;
    loadImages(numImagesAvailable, numItemsToGenerate, collectionID);
  }
});

function showLoading() {
  document.getElementById("loader").style.display = "block";
}

function hideLoading() {
  document.getElementById("loader").style.display = "none";
}

Wallpaper_upload_button.addEventListener("click", () => {
  grid.style.display = "none";
  genre.style.display = "none";
  hideLoading();
  Wallpaper_upload.style.display = "block";
  Wallpaper_upload_button.style.color = "#42a5f5";
  Wallpaper_Home_button.style.color = "white";
});

Wallpaper_Home_button.addEventListener("click", () => {
  grid.style.display = "grid";
  genre.style.display = "flex";

  Wallpaper_upload.style.display = "none";
  Wallpaper_Home_button.style.color = "#42a5f5";
  Wallpaper_upload_button.style.color = "white";
});
document.getElementById("save_upload").addEventListener("click", () => {
  const reader = new FileReader();

  let files = document.getElementById("image-file").files;
  reader.onload = async (event) => {
    document.body.style.backgroundImage = "url(" + event.target.result + ")";
    localStorage.setItem("wallpaper_img", event.target.result);
  };
  reader.readAsDataURL(files[0]);
});
document.getElementById("image-file").addEventListener("change", (event) => {
  readURL(document.getElementById("image-file"));
});

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
  loadImages(numImagesAvailable, numItemsToGenerate, collectionID);
  Wallpaper_dialoge.showModal();
});
Wallpaper_close.addEventListener("click", () => {
  Wallpaper_dialoge.close();
  removeAllElements();
});
