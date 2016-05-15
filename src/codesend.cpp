/**
 * https://github.com/ninjablocks/433Utils
 *
 * PIN Schemas : https://projects.drogon.net/raspberry-pi/wiringpi/pins/
 */
#include "RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>
#include <string>

bool eq(std::string s1, std::string c1, std::string c2) {
  return s1.compare(c1) == 0 || s1.compare(c2) == 0;
}

int main(int argc, char *argv[]) {
  
  //Programm Options
  struct Options {
    
    int PIN;
    int CODE;
    int PULSE_LENGTH;
    
    Options():  PIN(0),
                CODE(0),
                PULSE_LENGTH(350)
                {};
    
  } options;

  //If not available, exit
  if(wiringPiSetup() == -1) {
    return 0;
  }
  
  //Get options
  for (int i = 1; i < argc; i++) {
        
    if (eq(argv[i], "-p", "--pin") && argc > i+1) {
      options.PIN = atoi(argv[i+1]);
    }
    
    if (eq(argv[i], "-c", "--code") && argc > i+1) {
      options.CODE = atoi(argv[i+1]);
    }
    
    if (eq(argv[i], "-pl", "--pulse-length") && argc > i+1) {
      options.PULSE_LENGTH = atoi(argv[i+1]);
    }
    
  }

  
  //Send the code
  RCSwitch mySwitch = RCSwitch();
  mySwitch.enableTransmit(options.PIN);
  mySwitch.setPulseLength(options.PULSE_LENGTH);
  mySwitch.send(options.CODE, 24);
  
  printf("code: %i, pin: %i, pulseLength: %i\n", options.CODE, options.PIN, options.PULSE_LENGTH);

  return 0;

}