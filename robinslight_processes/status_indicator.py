import sys
import ledAPI

COLOR_MAP = {
    "red": (255,0,0),
    "green": (0,255,0),
    "blue": (0,0,255),
    "clear": (0,0,0)
}

STATUS_PIXELS = 5

if __name__ == '__main__':
    colorName = sys.argv[1]
    if colorName == None:
        raise Exception("Must specify color name")
    
    if colorName not in COLOR_MAP:
        raise Exception("Error: {0} is an invalid color".format(colorName))
    
    colorVal = COLOR_MAP[colorName]
    print("Setting LED indicator: {0}".format(colorName), colorVal)
    
    # ledAPI.setStripColor(colorVal)
    for i in range(STATUS_PIXELS):
        ledAPI.setLEDColor(i, colorVal)
    
    ledAPI.strip.show()

