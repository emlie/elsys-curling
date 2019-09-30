// jshint esversion: 6


// ARDUINO
let SerialPort = require('serialport');
let serialPort = new SerialPort('/dev/usbmodem14101', {
    baudRate: 9600
});


// ARDUINO
// Switches the port into "flowing mode"
serialPort.on('data', function (data) {
    console.log('Data:', data);
});// Read data that is available but keep the stream from entering //"flowing mode"
serialPort.on('readable', function () {
    console.log('Data:', port.read());
});
