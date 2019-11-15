// RINK DIMENSIONS IN FEET
let rinkWidth = 15; // 4.572 m
let rinkHeight = 142; // 43.28 m

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
let revDB = db.ref('gyroData');
let revAccDB = db.ref('accData');


const mass = 0.209; // [kg] uten lokk (364.1 g med lokk) | 209 g bare power bank
const deltaT = 0.91; // // 55 entries in 1 min ≈ 1 [s]

let dataEntries = 0;

let aX = 0; // acceleration [m/s^2]
let aY = 0;

let vX = 0; // velocity [m/s]
let pX = 0; // position

let vY = 0;
let pY = 0;


// ALL ALL IMU DATA
let allAX = [0];
let allAY = [0];
// let allAZ = [];

let allPX = [0];
let allPY = [0];





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





// Show database data
// when database changes (when new data is added), run function
// console.log(arduinoRevDB.key);

// from Arduino Uno Wifi Rev 2 IMU LSD LSM6DS3 => Firebase => table
function updateTable() {
  revAccDB.on('child_added', (snapshot) => {
    dataEntry = snapshot.val();

    tStoneData.innerHTML += `
    <tr>
      <td>${dataEntry.aX}</td>
      <td>${dataEntry.aXF3db}</td>
      <td>${dataEntry.aYF3db}</td>
      <td>${dataEntry.aY}</td>
    </tr>
    `;
  });
}





// STORE DATA
function storeValues(iterable, all, single) {
  iterable.forEach((element) => {
    all.push(element/mass);
    single = element;
  });
}


// GET VELOCITY
function getVelocity(range, acc, time) {
  return acc * time; // average velocity
}


// GET POSITON
function getPosition2(range, acc, velocity, time, list) {
  // veiformel 2:
  // s = v_0*t + (1/2)at^2

  let prevA = list[list.length - 1];
  let deltaA = (acc - prevA)/2;

  return velocity*time + (1/2)*deltaA*time^2;
}

function getPosition(range, acc, velocity, time) {
  // veiformel 2:
  // s = v_0*t + (1/2)at^2
  return (velocity*time*range) + (1/2)*acc*(time*range)^2;
}





// RUN FUNCTIONS
fillScoreBoard();

posHack();
drawLines();
posSVG();

updateTable();

btnAdd.addEventListener('click', () => {
  addStone('bottom');
});




revAccDB.on('child_added', snapshot => {

  let dataEntry = snapshot.val();

  // filtered data
  let aXG = dataEntry.aXF3db; // acceleration in force G=mg [m*m/s^2]
  let aX = aXG/mass; // acceleration in [m/s^2]

  let aYG = dataEntry.aYF3db;
  let aY = aYG/mass;

  // add to array
  allAX.push(aX);
  allAY.push(aY);

  dataEntries = allAX.length;

  // get velocities
  vX = getVelocity(dataEntries, aX, deltaT);
  vY = getVelocity(dataEntries, aY, deltaT);

  // get positions
  pX += getPosition2(dataEntries, aX, vX, deltaT, allAX) - 0.5;
  pY += getPosition2(dataEntries, aY, vY, deltaT, allAY) - 0.5;

});


// AFTER PUSHING ALL DATA FROM IMU TO NEW ARRAYS
revAccDB.on('value', (snapshot) => {
  console.log(`data entries: ${dataEntries}`);
  console.log(`LAST vX: ${vX} | vY: ${vY}`);
  console.log(`LAST pX: ${pX} | pY: ${pY}`);
});
