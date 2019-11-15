// jshint esversion: 6
// 8m på 4 sek => 2m per 1 sek i fraspark for steinen
/*
* ARDUINO TO JS:
https://hackernoon.com/arduino-serial-data-796c4f7d27ce
*/


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
// let stoneDB = db.ref('stone');
// let arduinoRevDB = db.ref('Test/Int')
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
// let allPZ = [];

// vX = 0; // velocity x
// pX = 0; // position x

// vY = 0; // velocity y
// pY = 0; // position y

// vZ = 0; // velocity z
// pZ = 0; // position z





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

  // stoneDB.on('child_added', getStoneData);
}





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





// STORE DATA
function storeValues(iterable, all, single) {
  iterable.forEach((element) => {
    all.push(element/mass);
    single = element;
  });
}


// GET VELOCITY
function getVelocity(range, acc, time) {

  // let prevA = allAX[allAX.length - 1];
  // let deltaA = (acc - prevA)/2;

  // console.log(`currA: ${acc} | prevA: ${prevA}`);

  // return (acc * deltaA) + prevA;
  return acc * time; // average velocity
  // return (acc * time * range);
}


// GET POSITON
function getPosition2(range, acc, velocity, time, list) {
  // veiformel 2:
  // s = v_0*t + (1/2)at^2
  let prevA = list[list.length - 1];
  let deltaA = (acc - prevA)/2;
  return velocity*time + (1/2)*deltaA*time^2;
  // return velocity*time + (1/2)*acc*time^2;
  // return (velocity * time) + ((1/2)*acc*range*(time^2));
  // return (velocity*time*range) + (1/2)*acc*(time*range)^2;
  // return (velocity * time * range) + ((1/2) * acc * ((time * range)^2));
}

function getPosition(range, acc, velocity, time) {
  // veiformel 2:
  // s = v_0*t + (1/2)at^2
  // return velocity*time + (1/2)*acc*time^2;
  // return (velocity * time) + ((1/2)*acc*range*(time^2));
  return (velocity*time*range) + (1/2)*acc*(time*range)^2;
  // return (velocity * time * range) + ((1/2) * acc * ((time * range)^2));
}





// RUN FUNCTIONS
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

updateTable();

btnAdd.addEventListener('click', () => {
  addStone('bottom');
  // moveStone(currentStone);
});



// FIND POSITION OF STONE FOR EACH DATA ENTRY (FROM PYTHON)
/*
revAccDB.on('child_added', (snapshot) => {

  // let mass = 0.5; // [kg]
  // let deltaT = 1; // delta time t (sec)

  // acceleration in force G=mg [m*m/s^2]
  // divide each element in aXG by mass to get actual acceleration
  let aXG = []; // acceleration x
  let aX = 0;
  let pX = 0;

  let aYG = []; // acceleration y
  let aY = 0;
  let pY = 0;

  // let aZG = []; // acceleration z
  // let aZ = 0;
  // let pZ = 0;

  let dataEntry = snapshot.val();

  // push data to arrays
  aXG.push(dataEntry.aX);
  aYG.push(dataEntry.aY);
  // aZG.push(dataEntry.aZ);

  // push all data from IMU to new array
  storeValues(aXG, allAX, aX);
  storeValues(aYG, allAY, aY);
  // storeValues(aZG, allAZ, aZ);

  // number of measurements
  let dataEntries = allAX.length;

  // get velocities
  let newVX = getVelocity(vX, dataEntries, aX, deltaT);
  let newVY = getVelocity(vY, dataEntries, aY, deltaT);
  // getVelocity(vZ, dataEntries, aZ, deltaT);

  // get positions
  getPosition(pX, dataEntries, aX, vX, deltaT);
  getPosition(pY, dataEntries, aY, vY, deltaT);
  // getPosition(pZ, dataEntries, aZ, vZ, deltaT);

  // push position data to array
  allPX.push(pX);
  allPY.push(pY);
  // allPZ.push(pZ);


  // console.log(`number of data entries: ${dataEntries}`);

  // console.log(`aXG: ${aXG}`);
  // console.log(`aYG: ${aYG}`);
  // console.log(`aYG: ${aZG}`);

  // console.log(`aX: ${allAX}`);
  // console.log(`aY: ${allAY}`);
  // console.log(`aZ: ${allAZ}`);

  console.log(`pX: ${allPX}`);
  console.log(`pY: ${allPY}`);
  console.log(`pZ: ${allPZ}`);

  console.log(' ');

});
*/


// const mass = 0.209; // [kg]
// const deltaT = 0.91; // // 55 entries in 1 min ≈ 1 [s]
// const reducer = (accumulator, currentValue) => accumulator + currentValue;

// let dataEntries = 0;

// let aX = 0; // acceleration
// let aY = 0;

// let vX = 0; // velocity [m/s]
// let pX = 0; // position

// let vY = 0;
// let pY = 0;

// FIND VELOCITY AND POSITION OF STONE FOR EACH DATA ENTRY
/*
revAccDB.on('child_added', (snapshot) => {

  let dataEntry = snapshot.val();

  let aXG = dataEntry.aXF3db; // acceleration in force G=mg [m*m/s^2]
  let aX = aXG/mass; // acceleration in [m/s^2]

  let aYG = dataEntry.aYF3db;
  let aY = aYG/mass;

  // add to array
  allAX.push(aX);
  allAY.push(aY);

  // pop last from array
  // allAX = allAX.slice(0, allAX.length - 1);

  // console.log(aX);
  // console.log(aY);

  dataEntries = allAX.length;

  // console.log(`BEFORE vX: ${vX} | vY: ${vY}`);
  // console.log(`BEFORE pX: ${pX} | pY: ${pY}`);

  // get actual velocities
  vX = getVelocity(dataEntries, aX, deltaT);
  vY = getVelocity(dataEntries, aY, deltaT);


  // get actual positions
  // pX += getPosition(dataEntries, aX, vX, deltaT);
  // pY += getPosition(dataEntries, aY, vY, deltaT);
  // pX = getPosition(dataEntries, aX, vX, deltaT);
  // pX = getPosition(dataEntries, aY, vY, deltaT);
  */


  /*
  let prevAX = allAX[allAX.length - 1];
  let deltaAX = (aX - prevAX)/2;

  let prevAY = allAY[allAY.length - 1];
  let deltaAY = (aY - prevAY)/2;

  pX = vX*deltaT + (1/2)*deltaAX*deltaT^2;
  pY = vY*deltaT + (1/2)*deltaAY*deltaT^2;

  console.log(allPX, allPY);
  */

  /*
  let prevAX = allAX[allAX.length - 1];
  let prevAY = allAY[allAY.length - 1];
  let s_0X = allPX.reduce(reducer);
  let s_0Y = allPY.reduce(reducer);
  pX += (1/4)*(aX + prevAX)*deltaT^2 + vX*deltaT;
  pY += (1/4)*(aY + prevAY)*deltaT^2 + vY*deltaT;
  */

  // pX = getPosition2(dataEntries, aX, vX, deltaT, allAX);
  // pY = getPosition2(dataEntries, aY, vY, deltaT, allAY);

  // log values
  // allPX.push(pX);
  // allPY.push(pY);

  // console.log(`data entries: ${dataEntries}`);
  // console.log(`allPositions: ${allPositions}`);
  // console.log(`allAX: ${allAX} | length: ${allAX.length}`);
  // console.log(`allAY: ${allAY}; length: ${allAY.length}`);
  // console.log(`NOW vX: ${vX} | vY: ${vY}`);
  // console.log(`NOW pX: ${pX} | pY: ${pY}`);
  // console.log(`last position: ${allPositions[allPositions.length - 1]}`);

// });

revAccDB.on('child_added', snapshot => {

  let dataEntry = snapshot.val();

  // filtered data
  let aXG = dataEntry.aXF3db; // acceleration in force G=mg [m*m/s^2]
  // let aXG = dataEntry.aX;
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
  // pX += (vX*deltaT*dataEntries) + (1/2)*aX*(deltaT*dataEntries)^2 - 2;
  // pY += (vY*deltaT*dataEntries) + (1/2)*aY*(deltaT*dataEntries)^2;
  // pX += (vX*deltaT)/dataEntries + (1/2)*aX*(deltaT*dataEntries)^2 - 1;
  // pX += (vX * deltaT) + ((1/2) * aX * ((deltaT * dataEntries)^2));
  // pY += (vY*deltaT)/dataEntries + (1/2)*aY*(deltaT*dataEntries)^2;

  pX += getPosition2(dataEntries, aX, vX, deltaT, allAX) - 0.5;
  pY += getPosition2(dataEntries, aY, vY, deltaT, allAY) - 0.5;

});


// AFTER PUSHING ALL DATA FROM IMU TO NEW ARRAYS
revAccDB.on('value', (snapshot) => {

  // dataEntries = allAX.length;

  // vX = 0; // velocity
  // pX = 0; // position

  // vY = 0;
  // pY = 0;

  // get actual velocities
  // vX += getVelocity(dataEntries, aX, deltaT);
  // vY += getVelocity(dataEntries, aY, deltaT);

  // get actual positions
  // pX += getPosition(dataEntries, aX, vX, deltaT);
  // pY += getPosition(dataEntries, aY, vY, deltaT);

  // log values
  // allPositions.push([pX, pY]);

  console.log(`data entries: ${dataEntries}`);
  // console.log(`allPositions: ${allPositions}`);
  // console.log(`allAX: ${allAX}`);
  // console.log(`allAY: ${allAY}`);
  console.log(`LAST vX: ${vX} | vY: ${vY}`);
  console.log(`LAST pX: ${pX} | pY: ${pY}`);
  // console.log(`LAST DIV pX: ${pX/2} | pY: ${pY}`);
  // console.log(`allAX: ${allAX}`);
  // console.log(`allAY: ${allAY}`);
  // console.log(`allAZ: ${allAZ}`);
  // console.log('');
  // console.log(`allPX: ${allPX}`);
  // console.log(`allPY: ${allPY}`);
  // console.log(`allPZ: ${allPZ}`);
});


/*
* x,y: 3.8 , -3.39
* x,y: 4.5, -1.75
* x,y: 4.45, -5.35
* x,y: 5.19, -7.9
*/

/*
* x,y: 0.20, 3.8
* x,y: 6.89, -5.35
* x,y: 5.75, -18
*/

/* 10 METERS
* x,y: 5.19, -19
* x,y: 10.1, 23.25
* x,y: -4.04, -16.15
*/
