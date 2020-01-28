import ledAPI

COLOR_MAP = {
    "pink": (255,20,147)
}

STATUS_PIXELS = 5

if __name__ == '__main__':
    colorVal = COLOR_MAP["pink"]
    print("Setting LED indicator: {0}".format(colorName), colorVal)
    for i in range(45):
        ledAPI.setLEDColor(i, colorVal)
    ledAPI.strip.show()
