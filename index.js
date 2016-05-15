var _               = require('underscore'),
    Q               = require('q'),
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

var Sniffer = function(options) {
  
  EventEmitter.call(this);
  var self = this;
  
  //Launch Sniffer
  var snifferProcess = spawn(
    path.join(__dirname, scripts.read), [
    '--pin', options.pin
  ]);

  //Emit data received
  snifferProcess.stdout.on('data', _.debounce(function (buffer) {
    
    var data = JSON.parse(buffer);

    if(lastCodeSent == data.code) {
      lastCodeSent = null;
      return;
    }
    console.log(data);
    self.emit('data', data);
    self.emit(data);

  }, options.debounceDelay, true));

  //Emit error messages
  snifferProcess.stderr.on('data', function (error) {

    self.emit('error', error);

  });
  
  //Kill sniffer process when exit
  process.on('SIGINT', function() {
    snifferProcess.kill();
    process.exit();
  });

};

util.inherits(Sniffer, EventEmitter);

module.exports = {

  /**
   * Create an instance of the sniffer
   *
   * @param   options
   *          options.pin             The pin on which to listen codes
   *          options.debounceDelay   Delay before reading another code
   *
   * @return  Sniffer   Sniffer instance (singleton)
   */
  sniffer: function (options) {

    _.defaults(options, {
      pin: 2,
      debounceDelay: 500
    });
    
    return snifferInstance || (snifferInstance = new Sniffer(options));

  },

  /**
   * Send a decimal code through 433Mhz (and return a promise).
   *
   * @param   code        Decimal code
   * @param   [options]   Options to configure pin or pulseLength
   *                      options.pin           Pin on which send the code
   *                      options.pulseLength   Pulse length
   * @param   [callback]  Callback(error, stdout)
   * @return  Promise
   */
  sendCode: function (code, options, callback) {

    var deferred = Q.defer(),
        defaults = {
          code: 0,
          options: {
            pin: 0,
            pulseLength: 350
          },
          callback: _.noop
        };

    //Check arguments length
    if(arguments.length === 0 || arguments.length > 3) {
      return deferred.reject(new Error('Invalid parameters. sendCode(code, [options, callback])'));
    }
    
    //Check if code is a number (and parse it)
    code = parseInt(code);
    if(!_.isNumber(code)) {
      return deferred.reject(new Error('First parameter must be a integer'));   
    }
    
    //Tidy up
    switch(arguments.length) {
        
      //function(code)
      case 1:
        
        options = defaults.options;
        callback = defaults.callback;

      break;

      //function(code, options || callback)
      case 2:

        //function(code, callback)
        if(_.isFunction(options)) {
          
          callback = options;
          options = defaults.options;
          
        //function(code, options)
        } else if (_.isObject(options)) {
          
          _.defaults(options, defaults.options);
          callback = defaults.callback;
          
        //function(code, ???)
        } else {
          
          return deferred.reject(new Error('Second parameter must be a function (callback) or an object (options)'));
          
        }

      break;
      
      //function(code, options, callback)
      default:
        
        _.defaults(options, defaults.options);
        
      break;

    }

    //To avoid to sniff this code that we are sending
    lastCodeSent = code;

    //Send the code
    exec([
      path.join(__dirname, scripts.emit),
      '--code', code,
      '--pin', options.pin,
      '--pulse-length', options.pulseLength
    ].join(' '), function (error, stdout, stderr) {
      
      error = error || stderr;
      
      if(error) {
        deferred.reject(error);
      } else {
        deferred.resolve(stdout);
      }
      
      callback(error, stdout);

    });
    
    return deferred.promise;

  }

};