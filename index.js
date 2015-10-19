var _               = require('underscore'),
    path            = require('path'),
    spawn           = require('child_process').spawn,
    exec            = require('child_process').exec,
    util            = require('util'),
    EventEmitter    = require('events').EventEmitter,
    lastCodeSent    = null,
    snifferInstance = null;

var scripts = {
  read: 'build/RFSniffer',
  emit: 'build/codesend',
};

var Sniffer = function(pin, debounceDelay) {

  EventEmitter.call(this);

  var self = this;
  var cmd = spawn(path.join(__dirname, scripts.read), [pin]);

  cmd.stdout.on('data', _.debounce(function (code) {

    code = parseInt(code);

    if(lastCodeSent == code) {
      lastCodeSent = null;
      return;
    }

    self.emit('codes', code);
    self.emit(code);

  }, debounceDelay, true));

  cmd.stderr.on('data', function (error) {

    self.emit('error', error);

  });

};

util.inherits(Sniffer, EventEmitter);

module.exports = {

  sniffer: function (pin, debounceDelay) {

    pin = typeof pin !== 'undefined' ? pin : 2;
    debounceDelay = typeof debounceDelay !== 'undefined' ? debounceDelay : 500;

    return snifferInstance || (snifferInstance = new Sniffer(pin, debounceDelay));

  },

  sendCode: function (code, pin, callback) {

    var defaults = {
      pin: 0,
      callback: function defaultCallback(){}
    };

    switch(arguments.length) {

      case 1:

        pin = defaults.pin;
        callback = defaults.callback;

      break;

      case 2:

        if(typeof pin === 'function') {
          callback = pin;
          pin = defaults.pin;
        } else if (typeof pin === 'number') {
          callback = function() {};
        } else {
          pin = defaults.pin;
          callback = defaults.callback;
        }

      break;

    }

    lastCodeSent = code;

    exec(path.join(__dirname, scripts.emit)+' '+pin+' '+code, function (error, stderr, stdout) {

      callback(error, stderr, stdout);

    });

  }

};
