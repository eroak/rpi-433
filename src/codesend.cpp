/**
 * https://github.com/ninjablocks/433Utils
 *
 * PIN Schemas : https://projects.drogon.net/raspberry-pi/wiringpi/pins/
 */
#include "RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>



int main(int argc, char *argv[]) {
  
  int PIN = atoi(argv[1]);
  int code = atoi(argv[2]);

  if (wiringPiSetup () == -1)
    return 1;

  printf("%i", code);
  RCSwitch mySwitch = RCSwitch();
  mySwitch.enableTransmit(PIN);

  mySwitch.send(code, 24);

  return 0;

}