import sys
import ledAPI

COLOR_MAP = {
    "red": (255,0,0),
    "green": (0,255,0),
    "blue": (0,0,255),
    "clear": (0,0,0),
    "white": (255, 255, 255)
}

STATUS_PIXELS = 5

if __name__ == '__main__':
    colorName = sys.argv[1]
    targetPixels = sys.argv[2]
    if targetPixels == None:
        targetPixels = STATUS_PIXELS


    if colorName == None:
        raise Exception("Must specify color name")

    if colorName not in COLOR_MAP:
        raise Exception("Error: {0} is an invalid color".format(colorName))

    colorVal = COLOR_MAP[colorName]
    print("Setting LED indicator: {0}".format(colorName), colorVal)

    # ledAPI.setStripColor(colorVal)
    for i in range(targetPixels):
        ledAPI.setLEDColor(i, colorVal)
    ledAPI.strip.show()
