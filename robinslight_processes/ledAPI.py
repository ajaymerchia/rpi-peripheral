import time
from neopixel import *


# This file will be responsible for setting the color of the LEDs
# LED strip confiuration:
LED_COUNT      = 60      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

RUNTIME_SPEEDUP = 1

# Process arguments
# Create NeoPixel object with appropriate configuration.
strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
# Intialize the library (must be called once before other functions).
strip.begin()

def wait(s):
    waitTime = s / RUNTIME_SPEEDUP
    time.sleep(waitTime)

def setStripColor(color):
    # print("setting", color)
    for i in range(LED_COUNT):
        setLEDColor(i, color)
    strip.show()

def setLEDColor(idx, color):
    format = Color(int(color[1]), int(color[0]), int(color[2])) # FIXME: Does the Neopixel API seriously conflate the green and red channels?
    strip.setPixelColor(idx, format)

if __name__ == '__main__':
    setStripColor((255, 0, 0)) # shows green, should be red
    wait(1)
    setStripColor((0, 255, 0)) # shows red, should be green
    wait(1)
    setStripColor((0, 0, 255)) # shows blue, should be blue
