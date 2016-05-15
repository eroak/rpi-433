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
    
    Options():  PIN(2)
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
    
  }
     
  RCSwitch mySwitch = RCSwitch();
  mySwitch.enableReceive(options.PIN);

  while(1) {

    if (mySwitch.available()) {
      
      printf("{\"code\": %i, \"pulseLength\": %i}", mySwitch.getReceivedValue(), mySwitch.getReceivedDelay());

      fflush(stdout);
      mySwitch.resetAvailable();

    }

  }

  return 0;

}