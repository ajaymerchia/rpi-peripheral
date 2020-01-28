# constants.py
# LEDpy constants
# Version 2.0
# Made for Raspberry Pi
# Created on 11/20/2019

import ledCommands as led

# timestamp:action:duration:frequency:colors
# Timestamp, action, duration are mandatory fields
# Frequency optional depending on instruction (set to 0)
# Colors must either be empty or comma separated list terminating with a comma
INSTRUCTION_FORMAT = r'^(\d+):(\w{4}):(\d+):(\d+):((\d+,)*):$'

# comma separated list of integers
COLOR_FORMAT = r'\d+'

# Command to function mapping
FUNCTIONS = {'toff': led.offEffect, 'stat': led.staticEffect, 'strb': led.strobeEffect, 'fade': led.fadeEffect, 'kill': led.killEffect}

# Validate commands before execution (validation necessary during testing, during performance set to false.)
VALIDATE = True

# Create the maxified format
MAXIFY = True