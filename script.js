// Переменные
const colorDivs = document.querySelectorAll(".color");
const adjustBtns = document.querySelectorAll(".adjust");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const saveBtn = document.querySelector(".save");
const currentHexes = document.querySelectorAll(".color h2");
const locks = document.querySelectorAll(".lock");
let initialColors;
const submitBtn = document.querySelector(".submit-save");
console.log(submitBtn);
const closeBtn = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-name");
let savedPalettes = [];
const library = document.querySelector(".library");
const libraryContainer = document.querySelector(".library-container");
const libraryClose = document.querySelector(".close-library");
// Events
libraryClose.addEventListener("click", closeLibrary);
library.addEventListener("click", openLibrary);
closeBtn.addEventListener("click", closeSave);
submitBtn.addEventListener("click", savePalette);
saveBtn.addEventListener("click", openSave);
locks.forEach((lock, index)=>{
  lock.addEventListener("click", ()=>{
    const activeDiv = colorDivs[index];
  activeDiv.classList.toggle("locked");
  lock.children[0].classList.toggle("fa-lock-open");
  lock.children[0].classList.toggle("fa-lock");
  });
});
currentHexes.forEach((hex, index)=> {
  hex.addEventListener("click", ()=>{
    copyToClipboard(hex);
  });
});
adjustBtns.forEach((adjustBtn, index) =>{
  adjustBtn.addEventListener("click", ()=> {
    openSliders(index)
  });
});
generateBtn.addEventListener("click", ()=>{
  randomColors();
});
sliders.forEach(slider=> {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index)=> {
  div.addEventListener("change", ()=> {
    updateTextUI(index)
  });
});
// functions
function randomColors() {
  initialColors = [];
  
  colorDivs.forEach((div, index)=> {
    const  randomColor = generateHex();
    const hexName = randomColor.hex();
    if(div.classList.contains("locked")) {
      initialColors.push(hexName);
      return;
    }
    
    div.style.backgroundColor = randomColor;
    div.children[0].innerText = hexName;
    initialColors.push(hexName);
    checkContrast(randomColor.hex(), div.children[0]);
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
    const icons = div.querySelectorAll(".controls button");
    icons.forEach(icon=>{
      checkContrast(color, icon);
    });
    
  });
  resetInputs();





}
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}
function checkContrast(color, text) {
  const luminance = chroma(color).luminance();
  if(luminance > 0.5) {
    text.style.color = "black";
  }
  else {
    text.style.color = "white";
  }
}
function openSliders(index) {
  const sliders = colorDivs[index].querySelector(".sliders");
  const closeAdjustment = sliders.querySelector(".close-adjustment");
  sliders.classList.toggle("active");
  closeAdjustment.addEventListener("click", ()=>{
    sliders.classList.remove("active");
  });
}
function colorizeSliders(color, hue, brightness, saturation) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const satScale = chroma.scale([noSat, color, fullSat]);
  saturation.style.background = `linear-gradient(to right, ${satScale(0)}, ${satScale(1)})`;
  const midBright = color.set("hsl.l", 0.5);
  const brightScale = chroma.scale(["black", midBright, "white"]);
  brightness.style.background = `linear-gradient(to right, ${brightScale(0)},${brightScale(0.5)}, ${brightScale(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}
function hslControls(e) {
  const index = e.target.getAttribute("data-hue") || e.target.getAttribute("data-bright") || e.target.getAttribute("data-sat");
  const bgColor = initialColors[index];
  const sliders = e.target.parentElement.querySelectorAll("input");
  const hue = sliders[0];
  const sat = sliders[2];
  const bright = sliders[1];
  const color = chroma(bgColor)
  .set("hsl.h", hue.value)
  .set("hsl.s", sat.value)
  .set("hsl.l", bright.value);
  colorDivs[index].style.backgroundColor = color;
  colorizeSliders(color, hue, bright, sat);
}
function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach(slider=>{
    if(slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if(slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue*100)/100;
    }
    if(slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue*100)/100;
    }
  });
}
function updateTextUI(index) {
  const textHex = colorDivs[index].children[0];
  const color = chroma(colorDivs[index].style.backgroundColor);
  const icons = colorDivs[index].querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  checkContrast(color, textHex);
  icons.forEach(icon=>{
    checkContrast(color, icon);
  });
}
function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.innerText = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  el.remove();
  const copyContainer = document.querySelector(".copy-container");
  const popup = copyContainer.children[0];
  copyContainer.classList.add("active");
  popup.classList.add("active");
  popup.addEventListener("transitionend", ()=> {
    copyContainer.classList.remove("active");
    popup.classList.remove("active");
  });
}
function openSave() {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}
function closeSave() {  
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}
function savePalette() {
  const popup = saveContainer.children[0];
  const colors = [];
  const name = saveInput.value;
  currentHexes.forEach(hex => {
    colors.push(hex.innerText);
  });
  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if(localStorage.getItem("parse") === null) {
    paletteNr = savedPalettes.length;
  }else {
  paletteNr = paletteObjects.length;
  }
  const paletteObj = {name, colors, nr:paletteNr};
  savedPalettes.push(paletteObj);
  savetoLocal(paletteObj);
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach(smallColor => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    smallDiv.style.width = "40px";
    smallDiv.style.height = "40px"; 
    preview.appendChild(smallDiv);
    
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "Select";
  paletteBtn.addEventListener("click", e=>{
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    initialColors = [];
    savedPalettes.colors.forEach((color, index)=> {
      initialColors.push(color);
    });
  })

  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}
function savetoLocal(palleteObj) {
  let localPalletes;
  if (localStorage.getItem("palettes") === null) {
    localPalletes = [];
  }
  else {
    localPalletes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalletes.push(palleteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalletes));
}
function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}
function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}
// Execute
randomColors();