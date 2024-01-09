
const Wallpaper_dialoge = document.querySelector('.Wallpaper_window');
const Wallpaper_main = document.querySelector('.wallpaper_main');
const Wallpaper_upload = document.querySelector('.wallpaper_upload');
const Wallpaper_close = document.querySelector('#close');
const wallpaper_button = document.querySelector('#wallpaper');
const Wallpaper_upload_button = document.querySelector('#Wallpaper_user_upload');
const Wallpaper_Home_button = document.querySelector('#Wallpaper_Home');

var bgimage = localStorage.getItem('wallpaper_img');
let is_home = true;

if(is_home){
    Wallpaper_Home_button.style.color = "#42a5f5";
    Wallpaper_upload_button.style.color = "black";
}else{
    Wallpaper_upload_button.style.color = "#42a5f5";
    Wallpaper_Home_button.style.color = "black";
}

// wallpaper
if (bgimage != null) {
    document.body.style.backgroundImage = "url(" + bgimage + ")";
}else{
    document.body.style.backgroundImage = "url('wallpapers/Wallpaper.jpg')";
}



const numImagesAvailable = 988  //how many photos are total in the collection
const numItemsToGenerate = 20; //how many photos you want to display
const imageWidth = 480;    //image width in pixels
const imageHeight = 480;   //image height in pixels
const collectionID = 928423  //Beach & Coastal, the collection ID from the original url
var wallpaper_lis = [];
function renderGalleryItem(randomNumber){
  fetch(`https://source.unsplash.com/collection/${collectionID}/${imageWidth}x${imageHeight}/?sig=${randomNumber}`)
    .then((response) => {
        wallpaper_lis.push(response.url)
       
  })
}
for(let i=0; i < numItemsToGenerate; i++){
    let randomImageIndex = Math.floor(Math.random() * numImagesAvailable);
    renderGalleryItem(randomImageIndex);
}
console.log(wallpaper_lis)

// var wallpaper_lis = ["wallpapers\\Wallpaper.jpg", "wallpapers\\Wallpaper1.jpg", "wallpapers\\Wallpaper2.jpg", "wallpapers\\Wallpaper3.jpg"];

var mosaic = new mosaicLayout({
    imagesArray: wallpaper_lis,
    lazyLoading: true,
    lazyLoadingClass: 'lazy',
    columns: 4,
    
});
mosaic.initiate();
mosaic.loadImages();
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('Display_img').setAttribute('src', e.target.result);
        };
        console.log(input.files[0])

        reader.readAsDataURL(input.files[0]);
    }
}
Wallpaper_upload_button.addEventListener('click', () => {
    Wallpaper_main.style.display = 'none';
    Wallpaper_upload.style.display = 'block';
    Wallpaper_upload_button.style.color = "#42a5f5";
    Wallpaper_Home_button.style.color = "black";

})

Wallpaper_Home_button.addEventListener('click', () => {
    Wallpaper_main.style.display = 'flex';
    Wallpaper_upload.style.display = 'none';
    Wallpaper_Home_button.style.color = "#42a5f5";
    Wallpaper_upload_button.style.color = "black";
})
document.getElementById('save_upload').addEventListener('click', () => {
    const reader = new FileReader();

    let files = document.getElementById('image-file').files
    reader.onload = async (event) => {
        document.body.style.backgroundImage = "url(" + event.target.result + ")";
        localStorage.setItem("wallpaper_img", event.target.result);
    }
    reader.readAsDataURL(files[0])

})
document.getElementById('image-file').addEventListener('change', (event) => {
    readURL(document.getElementById('image-file'));
})
document.getElementById('masonryContainer').addEventListener('click', (e) => {
    var bgimage = document.getElementById(e.target.id).src;
    if (bgimage) {
        document.body.style.backgroundImage = "url(" + bgimage + ")";
        localStorage.setItem("wallpaper_img", bgimage);
        console.log('id', bgimage)
    }
})


wallpaper_button.addEventListener("click", () => {

    Wallpaper_dialoge.showModal();

});
Wallpaper_close.addEventListener("click", () => {
    Wallpaper_dialoge.close();
});