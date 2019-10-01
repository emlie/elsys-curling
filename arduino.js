// jshint esversion: 6

var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/cu.usbmodem14101");
serialport.on('open', function(){
  console.log('Serial Port Opened');
  serialport.on('data', function(data){
      console.log(data[0]);
  });
});
