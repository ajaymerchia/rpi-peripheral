import ledAPI
import pickle
import sys

if __name__ == '__main__':
    targetProgram = sys.argv[1]
    targetFile = "../data/{0}.rl".format(targetProgram)

    r = open(targetFile, "rb+")
    blobLoaded = r.read().strip()
    lightshow = pickle.loads(blobLoaded)

    for pair in lightshow:
        ledAPI.setStripColor(pair[0])
        ledAPI.wait(pair[1])
