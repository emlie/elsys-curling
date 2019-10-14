// jshint esversion: 6
// 8m på 4 sek => 2m per 1 sek i fraspark for steinen
/*
* ARDUINO TO JS:
https://hackernoon.com/arduino-serial-data-796c4f7d27ce
*/


// RINK DIMENSIONS IN FEET
let rinkWidth = 15;
let rinkHeight = 142;

let rBlueRing = 12;
let rWhiteRing = 8;
let rRedRing = 4;
let rInnerRing = 1;

let backToHack = 4;
let backToBehindRing = 10;
let behindRingToCenter = 6;
let centerToHog = 21;
let hogToHog = 72;


// DOM
let dbName = document.querySelector('#dbName');
let pPosition = document.querySelector('#pPosition');
let pTime = document.querySelector('#pTime');
let tStoneData = document.querySelector('#tStoneData');

let scoreHead = document.querySelector('#scoreHead');
let scoreHome = document.querySelector('#scoreHome');
let scoreVisitor = document.querySelector('#scoreVisitor');

let wrapGraphic = document.querySelectorAll('.wrapGraphic')[0];


// COMPUTED STYLES
let graphicStyleWidth = window.getComputedStyle(wrapGraphic).width;
let graphicStyleHeight = window.getComputedStyle(wrapGraphic).height;

let graphicNumWidth = pxToNum(graphicStyleWidth);
let graphicNumHeight = pxToNum(graphicStyleHeight);

let fracWidth = graphicNumWidth/rinkWidth;
let fracHeight = graphicNumHeight/rinkHeight;


// FIREBASE
let db = firebase.database();
let stoneDB = db.ref('stone');





// STYLE STRING TO NUMBER
function pxToNum(string) {
  // remove "px" at the end and turn string to number
  return Number(string.slice(0, string.length - 2));
}





// FILL SCORE TABLE
function fillScoreBoard() {
  // console.log('fillScoreHead');

  // head
  for (let i = 1; i <= 10; i++) {
    scoreHead.innerHTML += `
    <div>
      <p>${i}</p>
    </div>
    `
  }

  scoreHead.innerHTML += `
  <div>
    <p class="fat">total</p>
  </div>
  `


  // home
  for (let i = 1; i <= 10; i++) {
    scoreHome.innerHTML += `
    <div>
      <p>${0}</p>
    </div>
    `
  }

  scoreHome.innerHTML += `
  <div>
    <p>00</p>
  </div>
  `


  // visitor
  for (let i = 1; i <= 10; i++) {
    scoreVisitor.innerHTML += `
    <div>
      <p>${0}</p>
    </div>
    `
  }

  scoreVisitor.innerHTML += `
  <div>
    <p>00</p>
  </div>
  `
}






// Display database name
function getStoneData(snapshot) {

  // primary key
  // let stone = snapshot.key;

  // other data
  let stoneData = snapshot.val();

  // stone data
  let posT = stoneData.time;
  let posX = stoneData.position[0];
  let posY = stoneData.position[1];
  let posZ = stoneData.position[2];

  // display data
  // show data in table
  tStoneData.innerHTML += `
  <tr>
    <td>${stoneData.time}</td>
    <td>${posX}</td>
    <td>${posY}</td>
    <td>${posZ}</td>
  </tr>
  `;

  // console.log(`stone: ${stone}`);
}


// on page load: add child
stoneDB.push({
  'position': [0, 1, 2],
  'time': 0
});





// DRAW LINES
function drawLines() {
  console.log('drawLines');

  // add line
  wrapGraphic.innerHTML += `<div class="line"></div>`;

  // line behind ring
  let behindRing = document.querySelectorAll('.line')[0];
  behindRing.style.width = `${graphicStyleWidth}`;
  behindRing.style.marginTop = `calc(var(--base)*${fracHeight*backToHack})`;
}





// Show database data
// when database changes (when new data is added), run function
stoneDB.on('child_added', getStoneData);

fillScoreBoard();

// GRAPHIC
console.log(`graphicNumWidth: ${graphicNumWidth}; fracWidth: ${fracWidth}`);
console.log(`graphicNumHeight: ${graphicNumHeight}; fracHeight: ${fracHeight}`);

drawLines();
