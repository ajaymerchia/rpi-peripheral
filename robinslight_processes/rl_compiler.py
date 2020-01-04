import lexer
import sys
import pickle
import datetime

def time():
    return datetime.datetime.now().timestamp()

def printDur(last, str):
    print("[{0}] Time elapsed: {1}".format(str, time()-last))

def checksum(obj):
    return ' '.join(map(str, obj))

if __name__ == '__main__':
    targetProgram = sys.argv[1]
    targetFile = "../data/{0}.rl".format(targetProgram)
    minified = open(targetFile + ".min", "r")
    minified = minified.read().strip()
    # print(minified)

    compiledLines = []
    error = lexer.execInstructions(minified, compiledLines)
    print(error)

    print("LEXER COMPLETE\n\n")
    for line in compiledLines:
        print(line)

    # cs1 = checksum(compiledLines)
    compiledBlob = pickle.dumps(compiledLines, protocol=2)
    w = open(targetFile, "wb+")
    w.write(compiledBlob)
    w.close()

    print("Instructions:\t{0}".format(len(compiledLines)))
    print("Bytes:\t\t{0}".format(len(compiledBlob)))
    print("Written to {0}".format(targetFile))
