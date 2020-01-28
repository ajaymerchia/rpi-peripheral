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
    targetProgramPath = sys.argv[1]
    targetFileMinified = "../data/{0}.rl".format(targetProgramPath)
    targetFileMaxified = "../data/{0}.rlmax".format(targetProgramPath)

    instrs = open(targetFileMinified + ".min", "r")
    instrs = instrs.read().strip()
    # print(minified)

    compiledLinesMinified = []
    compiledLinesMaxified = []
    error = lexer.execInstructions(instrs, minifiedSummary=compiledLinesMinified, maxifiedSummary=compiledLinesMaxified)
    print(error)

    print("LEXER COMPLETE\n\n")
    # for line in compiledLinesMinified:
    #     print(line)

    # for line in compiledLinesMaxified:
    #     print(line)

    # cs1 = checksum(compiledLines)
    compiledBlobMinified = pickle.dumps(compiledLinesMinified, protocol=2)
    compiledBlobMaxified = pickle.dumps(compiledLinesMaxified, protocol=2)
    
    wMin = open(targetFileMinified, "wb+")
    wMin.write(compiledBlobMinified)
    wMin.close()

    wMax = open(targetFileMaxified, "wb+")
    wMax.write(compiledBlobMaxified)
    wMax.close()

    print("Minified Instructions:\t{0}".format(len(compiledLinesMinified)))
    print("Minified Bytes:\t\t{0}".format(len(compiledBlobMinified)))
    print("Minified Written to {0}".format(targetFileMinified))

    print("Maxified Instructions:\t{0}".format(len(compiledLinesMaxified)))
    print("Maxified Bytes:\t\t{0}".format(len(compiledBlobMaxified)))
    print("Maxified Written to {0}".format(targetFileMaxified))
