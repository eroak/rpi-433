# rpi-433
[![npm version](https://badge.fury.io/js/rpi-433.svg)](http://badge.fury.io/js/rpi-433)

[![NPM](https://nodei.co/npm/rpi-433.png?downloads=true)](https://nodei.co/npm/rpi-433/)

NodeJS module to send and receive decimal codes through 433Mhz device on RaspberryPI 2

### Dependencies
* wiringPi : https://projects.drogon.net/raspberry-pi/wiringpi/

### Building WiringPi
```bash
pi@raspberrypi ~ $ git clone git://git.drogon.net/wiringPi
...
pi@raspberrypi ~ $ cd wiringPi/wiringPi
pi@raspberrypi ~/wiringPi/wiringPi $ sudo su
...
root@raspberrypi:/home/pi/wiringPi/wiringPi# ./build
```

### Installation

```bash
npm install rpi-433
```

### Usage
Firstly, make sure you are running your application as root or with sudo, else the Raspberry Pi will not let you output/input to the GPIO and you'll get an error.
```bash
sudo npm myscript.js
```

Please note that there are different and confusing ways to reference a channel. This module supports wPi schema. Once wiringPi is installed, in your CLI you can run `gpio readall` and check the wPi column or consult https://projects.drogon.net/raspberry-pi/wiringpi/pins/

```bash
gpio readall
```


### Example

```js
var rpi433    = require('rpi-433'),
    rfSniffer = rpi433.sniffer(),
    rfSend    = rpi433.sendCode;

// Receive    
rfSniffer.on('codes', function (code) {
  console.log('Code received: '+code);
});

// Send
rfSend(1234, function(error, stdout) {   //Send 1234
  if(!error) console.log(stdout); //Should display 1234
});

```
