# LED instruction set interpreter
# Version 2.0
# Made for Raspberry Pi
# Created on 11/20/2019

# Any effect returns whether it causes the entire sequence
# to terminate along with an error message.
import time
import sys

LOG = False

def rgb(hexVal):
	r = ((hexVal & 0xFF0000) >> 16)
	g = ((hexVal & 0xFF00) >> 8)
	b = (hexVal & 0xFF)
	return (int(r),int(g),int(b))

def addTo(compilerSummary, color, postWait):
	compilerSummary.append((color, postWait/float(1000)))

def offEffect(**kwargs):
	duration = kwargs.get('duration', None)
	summary = kwargs.get('summary', [])

	if duration is None:
		return True, 'invalid duration.'

	if LOG:
		print("OFF")
		print(duration)
	staticEffect(duration=duration, colors=[0], summary=summary)

	return False, 'success.'

def staticEffect(**kwargs):
	duration = kwargs.get('duration', None)
	color = kwargs.get('colors', None)[0]
	summary = kwargs.get('summary', [])

	if duration is None:
		return True, 'invalid duration.'
	elif color is None:
		return True, 'invalid color sequence.'

	if LOG:
		print("STATIC")
		print(duration)
		print(color)
	# TODO execute effect
	# executeColor(rgb(color))
	# wait(duration)
	addTo(summary, rgb(color), duration)
	# Sets the color to the specified color and then waits for that duration to expire


	return False, 'success.'

def strobeEffect(**kwargs):
	duration = kwargs.get('duration', None)
	frequency = kwargs.get('frequency', None)
	colors = kwargs.get('colors', None)
	summary = kwargs.get('summary', [])
	if duration is None:
		return True, 'invalid duration.'
	elif colors is None:
		return True, 'invalid colors.'
	elif frequency is None:
		return True, 'invalid frequency.'

	if LOG:
		print("STROBE")
		print(duration)
		print(colors)
		print(frequency)
	# TODO execute effect
	maxIdx = len(colors)

	numSwitches = int(duration/frequency)
	residual = duration - frequency * numSwitches

	for swap in range(numSwitches + 1):
		colorIdx = swap % maxIdx
		colorUsed = rgb(colors[colorIdx])
		# executeColor(colorUsed)
		if swap != numSwitches - 1:
			addTo(summary, colorUsed, frequency)
			# wait(frequency)
		else:
			addTo(summary, colorUsed, residual)
			# wait(residual)

	# Cycles through the colors for the duration of the effect, changing every FREQUENCY milliseconds until the

	return False, 'success.'

def fadeEffect(**kwargs):
	duration = kwargs.get('duration', None)
	colors = kwargs.get('colors', None)
	summary = kwargs.get('summary', [])

	if duration is None:
		return True, 'invalid duration.'
	elif colors is None:
		return True, 'invalid colors.'
	elif len(colors) < 2:
		return True, 'need at least 2 colors for fading'

	if LOG:
		print("FADE")
		print(duration)
		print(colors)

	finalColors = []
	finalHolds = []
	# TODO execute effect
	transitions = []
	for i in range(len(colors) - 1):
		transitions.append((colors[i], colors[i+1]))

	timePerTransition = duration/len(transitions)
	sectionDeltas = []

	timeRequested = 0

	for (start, end) in transitions:
		startC = rgb(start)
		endC = rgb(end)
		deltas = [(c[1]-c[0]) for c in zip(startC, endC)]
		sectionDeltas.append(deltas)

	for i in range(len(transitions)):
		currColor = rgb(transitions[i][0])

		deltas = sectionDeltas[i]
		numSteps = max(map(abs, deltas)) + 1
		durationPerStep = timePerTransition/(numSteps + 1)
		stepSize = list(map(lambda x: float(x)/numSteps, deltas))

		for stepIdx in range(numSteps):


			currColor = [max(0,sum(components)) for components in zip(currColor, stepSize)]

			for comp in currColor:
				if comp < 0:
					print("ERROR\n\n\n\n\n\n\n")
					print(i)
					print(stepSize, stepIdx, numSteps)
					print(summary[numSteps:])
					print(map(rgb, transitions[i]))
					sys.exit(-1)

			exportColor = tuple(map(round, currColor))
			timeRequested += durationPerStep
			# executeColor(exportColor)
			# wait(durationPerStep)
			addTo(summary, exportColor, durationPerStep)

	print("Fading effect scheduled to take up {0} of {1} allocation".format(timeRequested, duration))

	return False, 'success.'

def killEffect(**kwargs):
	if LOG:
		print("KILL")
	offEffect(duration=500)

	return True, 'success.'
