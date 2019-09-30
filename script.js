// DATATYPER
var info = 'tekst tekst tekst'; // datatype: string
var tall = 8; // datatype: number
var boolean = true; // true/false
var tabell = document.getElementById('tStoneData'); // tabellen fra HTML

var liste = [1, 2, 3];

var objekt = {
  navn: 'vår',
  alder: 4
};


function endreTabell() {

  // endrer HTML
  tabell.innerHTML = 'noe';

  console.log('endreTabell');
}

// endreTabell();



for (var i = 1; i <= 10; i++) {
  console.log(i);
}
