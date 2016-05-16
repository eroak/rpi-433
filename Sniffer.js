var _            = require('underscore'),
    util         = require('util'),
    path         = require('path'),
    spawn        = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter;



module.exports = Sniffer;



Sniffer.SCRIPT = 'build/RFSniffer';
Sniffer.process = null;
Sniffer.instance = null;

function Sniffer(options) {
  
  EventEmitter.call(this);
  
  //Launch Sniffer
  Sniffer.process = spawn(
    path.join(__dirname, Sniffer.SCRIPT), [
    '--pin', options.pin
  ]);

  //Emit data received
  Sniffer.process.stdout.on(
    'data',
    _.debounce(
      this.onData.bind(this),
      options.debounceDelay,
      true
    )
  );

  //Emit error messages
  Sniffer.process.stderr.on(
    'data',
    this.onError.bind(this)
  );

};

util.inherits(Sniffer, EventEmitter);

Sniffer.getInstance = function(options) {
  
  return Sniffer.instance || (Sniffer.instance = new Sniffer(options));
  
};

Sniffer.prototype.onError = function (error) {

  this.emit('error', error);

};

Sniffer.prototype.onData = function (buffer) {
  
  this.emit('data', JSON.parse(buffer));
  
};

//Kill sniffer process when exit
process.on('SIGINT', function() {
  
  if(!!Sniffer.process) {
    Sniffer.process.kill();
  }
  
  process.exit();
  
});