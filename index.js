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
  
  pin = pin || 2;
  debounceDelay = debounceDelay || 500;
  
  var self = this;
  var cmd = spawn(path.join(__dirname, scripts.read), [pin]);

  /**
   * onCode
   */
  cmd.stdout.on('data', _.debounce(function (code) {
    
    code = parseInt(code);
    
    if(lastCodeSent == code) {
      lastCodeSent = null;
      return;
    }
    
    self.emit('codes', code);
    self.emit(code);
    
  }, debounceDelay, true));

  /**
   * onError
   */
  cmd.stderr.on('data', function (error) {

    self.emit('error', error);

  });
  
};

util.inherits(Sniffer, EventEmitter);

module.exports = {
  
  sniffer: function () {
    
    return snifferInstance || (snifferInstance = new Sniffer());
    
  },
  
  sendCode: function (code, callback) {
    
    var pin = 0;
    callback = callback || function () {};
    lastCodeSent = code;
    exec(path.join(__dirname, scripts.emit)+' '+pin+' '+code, function (error, stderr, stdout) {
      
      callback(error, stderr, stdout);
      
    });
    
  }
  
};