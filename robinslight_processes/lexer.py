# lexer.py
# LED instruction set interpreter
# Version 2.0
# Made for Raspberry Pi
# Created on 11/20/2019

import re
import constants

# Execute the specified input sequence (formatted as string)
def execInstructions(instructions, minifiedSummary=[], maxifiedSummary=[], interval=100):
	if constants.VALIDATE:
		inputValid, err = validateInput(instructions)
		if not inputValid:
			return 'Bad instruction --> ' + err

	for line in instructions.split('\n'):
		terminate, err = execLine(line, minifiedSummary, maxifiedSummary, interval)
		if terminate:
			return 'Terminated --> ' + err
	return 'Instructions completed.'

# Execute a given line
def execLine(line, minifiedSummary, maxifiedSummary, interval):
	timestamp, action, duration, frequency, colorSeq, _ = re.match(constants.INSTRUCTION_FORMAT, line).groups()
	colors = re.findall(constants.COLOR_FORMAT, colorSeq)
	return constants.FUNCTIONS[action](timestamp=int(timestamp), duration=int(duration), frequency=int(frequency), colors=[int(c) for c in colors], minifiedSummary=minifiedSummary, maxifiedSummary=maxifiedSummary, interval=interval)

# Validate a given instruction sequence
def validateInput(instructions):
	for line in instructions.split('\n'):
		if not re.search(constants.INSTRUCTION_FORMAT, line):
			return False, line
	return True, None

input1 = "0:toff:1750:0::\n\
1750:stat:3250:0:16746240,:\n\
5000:fade:3000:0:16711734,16748800,16775936,8716032,65530,5701887,16711921,:\n\
8000:stat:5399:0:16755200,:\n\
13399:toff:799:0::\n\
14199:strb:5500:400:16711687,65440,16761344,7799039,:\n\
19700:stat:20300:0:62975,:\n\
40000:toff:700:0::\n\
40700:stat:1000:0:16711711,:\n\
41700:toff:2533:0::\n\
44233:stat:766:0:261888,:\n\
45000:toff:833:0::\n\
45833:fade:10000:0:16711734,16748800,16775936,8716032,65530,5701887,16711921,:\n\
55833:toff:299:0::\n\
56133:strb:10000:500:16777215,0,:\n\
66133:kill:0:0::"

if __name__ == '__main__':
	err = execInstructions(input1)
	print(err)
