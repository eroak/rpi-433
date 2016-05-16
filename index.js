var _       = require('underscore'),
    Sniffer = require('./Sniffer'),
    Emitter = require('./Emitter');

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
    
    return Sniffer.getInstance(options);

  },

  /**
   * Send a decimal code through 433Mhz (and return a promise).
   *
   * @param   [options]   Options to configure pin or pulseLength
   *                      options.pin           Pin on which send the code
   *                      options.pulseLength   Pulse length
   * 
   * @return  Function    Function used to send codes
   */
  emitter: function (options) {
    
    _.defaults(options, {
      pin: 0,
      pulseLength: 350
    });
    
    return new Emitter(options);
    
  }

};