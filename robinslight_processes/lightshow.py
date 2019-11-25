import ledAPI
import pickle
import sys
import time

if __name__ == '__main__':
    targetProgram = sys.argv[1]
    sent = sys.argv[2]
    transmissionLag = 0
    if sent:
        transmissionLag = time.time() - float(sys.argv[2])
        print("took {0}s to transmit".format(transmissionLag))

    targetFile = "../data/{0}.rl".format(targetProgram)

    r = open(targetFile, "rb+")
    blobLoaded = r.read().strip()
    lightshow = pickle.loads(blobLoaded)

    offset = 0
    startIdx = 0
    while offset < transmissionLag:
        offset += lightshow[startIdx][1]
        startIdx += 1

    # rollback the previous step
    startIdx -= 1
    offset -= lightshow[startIdx][1]
    print("{0}s delay skips {1} instructions".format(transmissionLag, startIdx))

    # Usual duration - (totalLag - compensated lag)
    firstDuration = lightshow[startIdx][1] - (transmissionLag - offset)

    print("starting at instruction {0} with {1} left for that instruction".format(startIdx, firstDuration))

    for i in range(startIdx, len(lightshow)):
        pair = lightshow[i]
        # if offset < transmissionLag:
        #     continue
        ledAPI.setStripColor(pair[0])
        ledAPI.wait(pair[1] if i != startIdx else firstDuration)

    print("SHOW COMPLETE")
    ledAPI.setStripColor((0,0,0))
