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
for(let i=0; i < 10; i++){
    let randomImageIndex = Math.floor(Math.random() * numImagesAvailable);

    renderGalleryItem(randomImageIndex);
}


// var wallpaper_lis = ["..\\wallpapers\\Wallpaper.jpg", "..\\wallpapers\\Wallpaper1.jpg", "..\\wallpapers\\Wallpaper2.jpg", "..\\wallpapers\\Wallpaper3.jpg"];

var mosaic = new mosaicLayout({
    imagesArray: wallpaper_lis,
    columns: "6",
    mobileColumns: "3",
    smallCutoff: 800 // breakpoint
});
mosaic.initiate();
mosaic.loadImages();
console.log("Original Array: \n" + wallpaper_lis);