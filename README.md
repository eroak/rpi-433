# rpi-433

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
rfSend(1234); //Send 1234

```
