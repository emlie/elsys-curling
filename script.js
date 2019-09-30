// DOM
let dbName = document.querySelector('#dbName');
let table = document.querySelectorAll('.wrapTStoneData')[0];


// FIREBASE
let db = firebase.database();
let stoneDB = db.ref('stone');


// Display database name
function getName(snapshot) {
  console.log('dbName');

  // primary key
  let stone = snapshot.key;

  // other data
  let stoneData = snapshot.val();

  // display name
  dbName.innerHTML = `${stone}`;

  console.log(stone);
  console.log(stoneData);
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
