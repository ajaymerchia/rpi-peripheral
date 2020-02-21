import ledAPI
import pickle
import sys
import time

targetFilePath = "../data/{0}.rl"

if __name__ == '__main__':
    targetProgram = sys.argv[1]
    sent = sys.argv[2]

    targetFile = targetFilePath.format(targetProgram)
    r = open(targetFile, "rb+")
    blobLoaded = r.read().strip()
    lightshow = pickle.loads(blobLoaded)

    transmissionLag = 0
    if sent:
        transmissionLag = time.time() - float(sys.argv[2])
        # print("took {0}s to transmit".format(transmissionLag))

    offset = 0
    startIdx = 0
    while offset < transmissionLag:
        offset += lightshow[startIdx][1]
        startIdx += 1

    # rollback the previous step
    startIdx -= 1
    offset -= lightshow[startIdx][1]
    # print("{0}s delay skips {1} instructions".format(transmissionLag, startIdx))

    # Usual duration - (totalLag - compensated lag)
    firstDuration = lightshow[startIdx][1] - (transmissionLag - offset)

    lightshow[startIdx] = (lightshow[startIdx][0], firstDuration)

    # print("starting at instruction {0} with {1} left for that instruction".format(startIdx, firstDuration))

    for i in range(startIdx, len(lightshow)):
        pair = lightshow[i]
        setTime = time.time()
        ledAPI.setStripColor(pair[0])
        executionTime = time.time() - setTime
        
        time.sleep(max(pair[1] - executionTime, 0))


    print("SHOW COMPLETE")
    ledAPI.setStripColor((0,0,0))
