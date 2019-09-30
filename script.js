// jshint esversion: 6
// 8m på 4 sek => 2m per 1 sek i fraspark for steinen
/*
* ARDUINO TO JS:
https://hackernoon.com/arduino-serial-data-796c4f7d27ce
*/


// DOM
let dbName = document.querySelector('#dbName');
let pPosition = document.querySelector('#pPosition');
let pTime = document.querySelector('#pTime');
let tStoneData = document.querySelector('#tStoneData');


// FIREBASE
let db = firebase.database();
let stoneDB = db.ref('stone');






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





// Show database data
// when database changes (when new data is added), run function
stoneDB.on('child_added', getStoneData);
