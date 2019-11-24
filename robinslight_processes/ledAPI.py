import time

# This file will be responsible for setting the color of the LEDs
# LED strip configuration:
LED_COUNT      = 16      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

RUNTIME_SPEEDUP = 10


def wait(s):
    waitTime = s / RUNTIME_SPEEDUP
    print("waiting", waitTime)
    time.sleep(waitTime)

def setStripColor(color):
    print("setting", color)
    for i in range(LED_COUNT):
        setLEDColor(i, color)
    # strip.show()

def setLEDColor(idx, color):
    pass
