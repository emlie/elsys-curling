// DOM
let dbName = document.querySelector('#dbName');
let table = document.querySelectorAll('.wrapTStoneData')[0];


// FIREBASE
let db = firebase.database();
let positionDB = db.ref('position');


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


// Show database data
// when database changes (when new data is added), run function
positionDB.on('child_added', getName);


// getName();

console.log(positionDB);
