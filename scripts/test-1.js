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
