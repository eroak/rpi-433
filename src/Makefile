all: codesend RFSniffer
	
codesend: RCSwitch.o codesend.o
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $+ -o ../build/$@ -lwiringPi
	
RFSniffer: RCSwitch.o RFSniffer.o
	$(CXX) $(CXXFLAGS) $(LDFLAGS) $+ -o ../build/$@ -lwiringPi

clean:
	$(RM) *.o codesend RFSniffer
