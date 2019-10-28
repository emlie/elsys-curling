// jshint esversion: 6
// 8m på 4 sek => 2m per 1 sek i fraspark for steinen
/*
* ARDUINO TO JS:
https://hackernoon.com/arduino-serial-data-796c4f7d27ce
*/

/*
import { create, all } from 'mathjs'

// create a mathjs instance with configuration
const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 64,
  predictable: false,
  randomSeed: null
}
const math = create(all, config)
*/

// https://www.npmjs.com/package/mathjs-simple-integral
// math.import(require('mathjs-simple-integral'));

// let Calculess = require('calculess');
// let Calc = Calculess.prototype;


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

// CURRENT GAME
// even number = yellow
// odd number = red
let currentStoneNum = 0;
let currentPos = 'bottom';
let currentStone;


// DOM
let dbName = document.querySelector('#dbName');
let pPosition = document.querySelector('#pPosition');
let pTime = document.querySelector('#pTime');
let tStoneData = document.querySelector('#tStoneData');

let scoreHead = document.querySelector('#scoreHead');
let scoreHome = document.querySelector('#scoreHome');
let scoreVisitor = document.querySelector('#scoreVisitor');

let wrapGraphic = document.querySelectorAll('.wrapGraphic')[0];

let btnAdd = document.querySelector('#btnAdd');


// COMPUTED STYLES
let graphicStyleWidth = window.getComputedStyle(wrapGraphic).width;
let graphicStyleHeight = window.getComputedStyle(wrapGraphic).height;

let graphicNumWidth = pxToNum(graphicStyleWidth);
let graphicNumHeight = pxToNum(graphicStyleHeight);

let fracWidth = graphicNumWidth/rinkWidth;
let fracHeight = graphicNumHeight/rinkHeight;


// FIREBASE
let db = firebase.database();
// let stoneDB = db.ref('stone');
// let arduinoRevDB = db.ref('Test/Int')
let revDB = db.ref('gyroData/position');
let revAccDB = db.ref('accData');





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
    `;
  }

  scoreHead.innerHTML += `
  <div>
    <p class="fat">total</p>
  </div>
  `;


  // home
  for (let i = 1; i <= 10; i++) {
    scoreHome.innerHTML += `
    <div>
      <p>${0}</p>
    </div>
    `;
  }

  scoreHome.innerHTML += `
  <div>
    <p>00</p>
  </div>
  `;


  // visitor
  for (let i = 1; i <= 10; i++) {
    scoreVisitor.innerHTML += `
    <div>
      <p>${0}</p>
    </div>
    `;
  }

  scoreVisitor.innerHTML += `
  <div>
    <p>00</p>
  </div>
  `;
}






// Display database name
/*
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
*/





// POSITION HACKS
function posHack() {

  // console.log('posHack');

  // get hacks
  let topHack = document.querySelectorAll('.hack')[0];
  let bottomHack = document.querySelectorAll('.hack')[1];

  // get style
  let hackStyleWidth = window.getComputedStyle(topHack).width;
  let hackNumWidth = pxToNum(hackStyleWidth);

  // set margin
  topHack.style.marginTop = `calc(var(--base)*${(fracHeight*backToHack)/10})`;
  topHack.style.marginLeft = `${(graphicNumWidth/2)-(hackNumWidth/2)}px`;

  bottomHack.style.bottom = `calc(var(--base)*${(fracHeight*backToHack)/10})`;
  bottomHack.style.marginLeft = `${(graphicNumWidth/2)-(hackNumWidth/2)}px`;

}


// DRAW LINES
function drawLines() {
  // console.log('drawLines');

  // make lines
  for (var i = 0; i < 8; i++) {
    wrapGraphic.innerHTML += `<div class="line"></div>`;
  }

  // get all lines (array)
  let allLines = document.querySelectorAll('.line');

  // set line width
  for (let line of allLines) {
    line.style.width = `${graphicNumWidth-2}px`;
  }

  // identified lines
  let topBackHack = document.querySelectorAll('.line')[0];
  let topBehindRing = document.querySelectorAll('.line')[1];
  let topCenterRing = document.querySelectorAll('.line')[2];
  let topCenterToHog = document.querySelectorAll('.line')[3];

  let bottomBackHack = document.querySelectorAll('.line')[4];
  let bottomBehindRing = document.querySelectorAll('.line')[5];
  let bottomCenterRing = document.querySelectorAll('.line')[6];
  let bottomCenterToHog = document.querySelectorAll('.line')[7];

  // style hog lines
  topCenterToHog.classList.add('hog');
  bottomCenterToHog.classList.add('hog');

  // set margin
  topBackHack.style.marginTop = `calc(var(--base)*${(fracHeight*backToHack)/6})`;
  topBehindRing.style.marginTop = `calc(var(--base)*${(fracHeight*backToBehindRing)/6})`;
  topCenterRing.style.marginTop = `calc(var(--base)*${(fracHeight*behindRingToCenter)/6})`;
  topCenterToHog.style.marginTop = `calc(var(--base)*${(fracHeight*centerToHog)/4.5})`;

  bottomBackHack.style.bottom = `calc(var(--base)*${(fracHeight*backToHack)/6})`;
  bottomBehindRing.style.bottom = `calc(var(--base)*${(fracHeight*backToBehindRing)/6})`;
  bottomCenterRing.style.bottom = `calc(var(--base)*${(fracHeight*behindRingToCenter)/6})`;
  bottomCenterToHog.style.bottom = `calc(var(--base)*${(fracHeight*centerToHog)/4.5})`;

}


/*
// MAKE HOUSES
function makeHouses() {
  // console.log('makeHouses');

  // make circles
  for (var i = 0; i < 4; i++) {
    wrapGraphic.innerHTML += `<div class="circle"></div>`;
  }

  // get all circles (array)
  let allCircles = document.querySelectorAll('.circle');

  // identified circles
  let topBlue = document.querySelectorAll('.circle')[0];
  let topRed = document.querySelectorAll('.circle')[1];

  let bottomBlue = document.querySelectorAll('.circle')[2];
  let bottomRed = document.querySelectorAll('.circle')[3];

  // set style
  topBlue.classList.add('blue');
  topBlue.style.width = `${45*2}px`; // from screen measurement (browser extension)
  topBlue.style.height = topBlue.style.width
  topBlue.style.marginTop = `calc(var(--base)*${(fracHeight*backToBehindRing)/8})`;
  topBlue.style.marginLeft = `${(graphicNumWidth/2)-45}px`;

  topRed.classList.add('red');
  topRed.style.width = `${(45/2.25)*2}px`; // from screen measurement (browser extension)
  topRed.style.height = topRed.style.width
  topRed.style.marginTop = `calc(var(--base)*${(fracHeight*behindRingToCenter)/3.6})`;
  topRed.style.marginLeft = `${(graphicNumWidth/2)-(45/2.25)}px`;

  bottomBlue.classList.add('blue');
  bottomBlue.style.width = `${45*2}px`; // from screen measurement (browser extension)
  bottomBlue.style.height = topBlue.style.width
  bottomBlue.style.bottom = `calc(var(--base)*${(fracHeight*backToBehindRing)/8})`;
  bottomBlue.style.marginLeft = `${(graphicNumWidth/2)-45}px`;

  bottomRed.classList.add('red');
  bottomRed.style.width = `${(45/2.25)*2}px`; // from screen measurement (browser extension)
  bottomRed.style.height = topRed.style.width
  bottomRed.style.bottom = `calc(var(--base)*${(fracHeight*behindRingToCenter)/3.6})`;
  bottomRed.style.marginLeft = `${(graphicNumWidth/2)-(45/2.25)}px`;
}
*/


// POSITION HOUSE SVGS
function posSVG() {

  // get svgs
  let topHouse = document.querySelectorAll('.house')[0];
  let bottomHouse = document.querySelectorAll('.house')[1];

  // bottomHouse.style.display = 'none';

  // style
  topHouse.style.width = `${(fracWidth*rBlueRing)/2}px`;
  topHouse.style.marginLeft = `${graphicNumWidth/3.325}px`;
  topHouse.style.marginTop = `calc(var(--base)*${(fracHeight*backToBehindRing)/11.5})`;

  bottomHouse.style.width = `${(fracWidth*rBlueRing)/2}px`;
  bottomHouse.style.marginLeft = `${graphicNumWidth/3.325}px`;
  bottomHouse.style.bottom = `calc(var(--base)*${(fracHeight*backToBehindRing)/11.5})`;

}





// MAKE A STONE
class Stone {

  constructor(color, startPos) {
    this.color = color; // @string: red or yellow
    this.startPos = startPos; // @string: top or bottom
  }


  make() {

    let stone = `
      <svg height="25" width="25" id="stone${currentStoneNum}" class="stone">
        <circle cx="11.5" cy="11.5" r="10" stroke="black" stroke-width="3" fill="${this.color}" />
      </svg>
    `;

    // add to DOM
    wrapGraphic.innerHTML += stone;

    // get stone
    currentStone = document.querySelector(`#stone${currentStoneNum}`);
    // console.log(currentStone.id);

    // position
    currentStone.style.setProperty("--left", `${(graphicNumWidth/2)-(45/3.85)}px`);

    // set margin
    if (this.startPos == 'top') {
      currentStone.style.setProperty('--bottom', 'auto');
      currentStone.style.setProperty(`--${this.startPos}`, `calc(var(--base)*${(fracHeight*behindRingToCenter)/3.15})`);
    } else if (this.startPos == 'bottom') {
      currentStone.style.setProperty('--top', 'auto');
      currentStone.style.setProperty(`--${this.startPos}`, `calc(var(--base)*${(fracHeight*behindRingToCenter)/3.2})`);
    }

  }

}





// ADD A STONE
function addStone(startPos) {

  let currentColor = '';

  currentStoneNum += 1;

  console.log(currentStoneNum);

  // every other stone is red, starting at 1
  if ((currentStoneNum % 2) == 0) {
    currentColor = 'yellow';
  } else {
    currentColor = 'red';
  }

  let newStone = new Stone(currentColor, startPos);

  // add stone to DOM
  newStone.make();

}





// ANIMATE STONE
function moveStone(stone) {

  console.log(`move ${stone.id}`);

  // animate with WAAPI
  let kf = [
    /*
    {
      transform: `translateX(${variable}px)
                  translateY(${(-1)*variable}px)`
    }
    */
  ];

  let speed = {
    duration: 5000, // ms
    iterations: 1,
    direction: 'forward'
  };

  stone.animate(kf, speed);

}





// Show database data
// when database changes (when new data is added), run function
// console.log(arduinoRevDB.key);

// from Arduino Uno Wifi Rev 2 IMU LSD LSM6DS3 => Firebase => table
revAccDB.on('child_added', (snapshot) => {
  dataEntry = snapshot.val();

  tStoneData.innerHTML += `
  <tr>
    <td>empty</td>
    <td>${dataEntry.aX}</td>
    <td>${dataEntry.aY}</td>
    <td>${dataEntry.aZ}</td>
  </tr>
  `;
});

// stoneDB.on('child_added', getStoneData);





// INTEGRATE LSM6DS3 DATA

function integrate() {

  // for every x-value in every data entry, integrate:
  // integrand: @string
  // variable of integration: @string
  // math.integral('x^2', 'x'); // 'x ^ 3 / 3'

  // loop through all data entries
  for(let entry of revAccDB) {
    console.log(entry);
  }

}

// integrate();





fillScoreBoard();


// GRAPHIC
// console.log(`graphicNumWidth: ${graphicNumWidth}; fracWidth: ${fracWidth}`);
// console.log(`graphicNumHeight: ${graphicNumHeight}; fracHeight: ${fracHeight}`);


posHack();
drawLines();
// makeHouses();
posSVG();

// addStone('top');
// addStone('bottom');

btnAdd.addEventListener('click', () => {
  addStone('bottom');
  // moveStone(currentStone);
});
