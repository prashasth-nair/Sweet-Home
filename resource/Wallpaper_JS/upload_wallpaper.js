const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const uploadedImage = document.getElementById("uploadedImage");
const Image_Preview = document.querySelector(".Image-Preview");

var Wallpaper_Url = null;

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", handleFileSelect);

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
  dropZone.innerText = "Drag & Drop or Click to Upload";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    handleFileSelect();
  }
 
});

function handleFileSelect() {
  const file = fileInput.files[0];
  Image_Preview_start();
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      Wallpaper_Url = e.target.result;
      uploadedImage.src = Wallpaper_Url;
    };
    reader.readAsDataURL(file);
  }
}
document.getElementById("preview_cancel").addEventListener("click", () => {
  Image_Preview_end();
});
document.getElementById("preview_apply").addEventListener("click", () => {
    if (Wallpaper_Url != null) {
        document.body.style.backgroundImage = "url(" + Wallpaper_Url + ")";
        localStorage.setItem("wallpaper_img", Wallpaper_Url);
        console.log("id", Wallpaper_Url);
      }
      Wallpaper_dialoge.close();
      Image_Preview_end();
      removeAllElements();

});

function Image_Preview_start() {
  Wallpaper_header.style.display = "none";
  Wallpaper_footer.style.display = "none";
  dropZone.style.display = "none";
  Image_Preview.style.display = "block";
}

function Image_Preview_end() {
  Wallpaper_header.style.display = "block";
  Wallpaper_footer.style.display = "flex";
  dropZone.style.display = "flex";
  Image_Preview.style.display = "none";
}
