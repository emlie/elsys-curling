// jshint esversion: 6

/*
const dsp = require('dsp.js');
let filter = IIRFilter(DSP.LOWPASS, 200, 1, 44100);
filter.process(signal);
console.log(signal);
*/


/*
var digitalsignals = require("digitalsignals");
var filter = IIRFilter(LOWPASS, 200, 44100);
filter.process(signal);
*/


// console.log(2+2);

/*
const dsp = require('dsp.js');
let filter = dsp.IIRFilter(dsp.LOWPASS, 200, 1, 44100);
let funct = dsp.func.process;

console.log(dsp);
console.log(dsp.IIRFilter);
// console.log(funct([1,2]));
// console.log(func.process(signal));
// console.log(filter);

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let filtered_arr = [];

arr.forEach(element => {
  filtered_data = filter.process(element);
  filtered_arr.push(filtered_data);
});

console.log(filtered_arr);
*/





// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
let app = require('@firebase/app');

// Add the Firebase products that you want to use
// require("firebase/auth");
let firebase = require('@firebase/database');

// Initialize the default app
// let admin = require('firebase-admin');
// let app = admin.initializeApp();


console.log(revAccDB);
// path to database
console.log(revAccDB.path.pieces_[0]);



/*
const dsp = require('dsp.js');

let filter = new dsp.IIRFilter(dsp.LOWPASS, 200, 1, 44100);

let mass = 0.2; // [kg]
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let allAXG = [-0.02, 0.01, 0.07, -0.05, -0.01, 0.01, 0.01, 0.06, 0.07, 0.06, -0.01];
let allAYG = [-0.05, -0.03, -0.16, -0.12, -0.02, -0.05, -0.11, -0.09, 0, -0.13, -0.03];
let allAX = [];
let allAY = [];

// convert acceleration  in G [m^2/s^2] to a [m/s^2]
allAXG.forEach(num => allAX.push(num));
allAYG.forEach(num => allAY.push(num));

filter.process(allAX);
filter.process(allAY);

console.log(allAX);
console.log(allAY);
*/




/*
let Fili = require('fili');

let iirCalculator = new Fili.CalcCascades();

// get available filters
let availableFilters = iirCalculator.available();

// calculate filter coefficients
let iirFilterCoeffs = iirCalculator.lowpass({
    order: 3, // cascade 3 biquad filters (max: 12)
    characteristic: 'butterworth',
    Fs: 1000, // sampling frequency
    Fc: 100, // cutoff frequency / center frequency for bandpass, bandstop, peak
    BW: 1, // bandwidth only for bandstop and bandpass filters - optional
    gain: 0, // gain for peak, lowshelf and highshelf
    preGain: false // adds one constant multiplication for highpass and lowpass
    // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
  });

// create a filter instance from the calculated coeffs
let iirFilter = new Fili.IirFilter(iirFilterCoeffs);

console.log(iirFilterCoeffs);
// console.log(iirFilter);
*/
