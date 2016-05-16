var _            = require('underscore'),
    Q            = require('q'),
    path         = require('path'),
    exec         = require('child_process').exec,
    util         = require('util');



module.exports = Emitter;



Emitter.SCRIPT = 'build/codesend';

function Emitter(options) {
  
  this.options = options;

}

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
Emitter.prototype.sendCode = function (code, options, callback) {
  
  var deferred = Q.defer();
  
  //NoOp as default callback
  if(!_.isFunction(callback)) {
    callback = _.noop;
  }
  
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

      options = this.options;

    break;

    //function(code, options || callback)
    case 2:

      //function(code, callback)
      if(_.isFunction(options)) {

        callback = options;
        options = this.options;

      //function(code, options)
      } else if (_.isObject(options)) {

        _.defaults(options, this.options);

      //function(code, ???)
      } else {

        return deferred.reject(new Error('Second parameter must be a function (callback) or an object (options)'));

      }

    break;

    //function(code, options, callback)
    default:

      _.defaults(options, this.options);

    break;

  }
  
  //Send the code
  exec([path.join(__dirname, Emitter.SCRIPT),
    '--code',         code,
    '--pin',          options.pin,
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

};