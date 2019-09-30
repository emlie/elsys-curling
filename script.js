// jshint esversion: 6

// DOM
let dbName = document.querySelector('#dbName');
let pPosition = document.querySelector('#pPosition');
let pTime = document.querySelector('#pTime');
let tStoneData = document.querySelector('#tStoneData');


// FIREBASE
let db = firebase.database();
let stoneDB = db.ref('stone');


// Display database name
function getName(snapshot) {

  // primary key
  let stone = snapshot.key;

  // other data
  let stoneData = snapshot.val();

  // display data
  // show data in table
  tStoneData.innerHTML += `
  <tr>
    <td>${stoneData.time}</td>
    <td>${stoneData.position[0]}</td>
    <td>${stoneData.position[1]}</td>
    <td>${stoneData.position[2]}</td>
  </tr>
  `;

  console.log(`stone: ${stone}`);
}

// add child
stoneDB.push({
  'position': [0, 1, 2],
  'time': 0
});


// Show database data
// when database changes (when new data is added), run function
stoneDB.on('child_added', getName);


// getName(stoneDB[0]);
// 8m på 4 sek => 2m per 1 sek i fraspark for steinen
