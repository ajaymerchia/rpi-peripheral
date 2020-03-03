TARGETFILEPATH = "/etc/wpa_supplicant/wpa_supplicant.conf"
NUM_LINES_TO_SAVE = 3


f = open(TARGETFILEPATH, "r")
newfilecontents = "".join(f.readlines()[:NUM_LINES_TO_SAVE-1])
f.close()


f = open(TARGETFILEPATH, "w")
f.truncate(0)
f.write(newfilecontents)
f.close()
