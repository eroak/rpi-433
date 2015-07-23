/**
 * https://github.com/ninjablocks/433Utils
 *
 * PIN Schemas : https://projects.drogon.net/raspberry-pi/wiringpi/pins/
 */
#include "RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>
     
RCSwitch mySwitch;



int main(int argc, char *argv[]) {
  
  int PIN = atoi(argv[1]);

  if(wiringPiSetup() == -1)
   return 0;

  mySwitch = RCSwitch();
  mySwitch.enableReceive(PIN);

  while(1) {

    if (mySwitch.available()) {

      int value = mySwitch.getReceivedValue();

      if (value == 0) {
        
        printf("0");
      
      } else {
      
        printf("%i", mySwitch.getReceivedValue());
      
      }

      fflush(stdout);
      mySwitch.resetAvailable();

    }

  }

  exit(0);

}