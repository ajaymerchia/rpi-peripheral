import os

def extractESSIDsAsList():
	stream = os.popen('sudo iwlist wlan0 scan').read().split('ESSID:"')
	unfilteredNames = [s.split('\n')[0][:-1] for s in stream][1:]
	return [n for n in unfilteredNames if len(n) > 0]

def extractFormattedESSIDs():
	soln = ''
	for net in extractESSIDsAsList():
		soln += (net + ',')
	return soln

print(extractFormattedESSIDs())