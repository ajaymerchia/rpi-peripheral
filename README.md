# Raspberry Pi Config Instructions
##  1. Installing the OS

Follow this guide  [https://learn.sparkfun.com/tutorials/getting-started-with-the-raspberry-pi-zero-wireless/all](https://learn.sparkfun.com/tutorials/getting-started-with-the-raspberry-pi-zero-wireless/all)
1. Download Rasbian
    -   [https://downloads.raspberrypi.org/raspbian_latest](https://downloads.raspberrypi.org/raspbian_latest)
2. Flash using etcher
    -   [https://etcher.io/](https://etcher.io/)
    -   You may need to uninstall and reinstall between setups ¯\_(ツ)_/¯
 3. Follow the onscreen setup instructions once the Pi Zero W sets up.
	 - Make sure to set the password to `robinpooh`
	 - Make sure that wifi is setup so you can download RobinsLight


## 2. Download RobinsLight
We need `git` installed on the RaspberryPi. It should already be there, but you can install/update `git` using Raspbian.
```
sudo apt-get install git
```

To download RobinsLight, you'll need to clone the repository and put it in the proper folder.

```
cd ~
mkdir wkspc
cd wkspc
git clone https://github.com/ajaymerchia/rpi-peripheral.git
```

You also need to setup the run time script.

```
cd ~
touch robinslight_start
echo "cd /home/pi/wkspc/rpi-peripheral && sudo ./status red &" > robinslight_start
echo "cd /home/pi/wkspc/rpi-peripheral && sudo ./bleconfig" > robinslight_start
echo "cd /home/pi/wkspc/rpi-peripheral/server && sudo npm start" > robinslight_start
chmod +x robinslight_start
```
 
## 3. Setup Node & NPM
Run `uname -m` in terminal and you'll see what type of processor this Pi is equipped with.

Download the right package here: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
> Pi3 uses Linux Binaries (ARM) v7.0
> Pi Zero W uses Linux Binaries (ARM) v6.0l

Decompress the file using the archive utility, then install it using **FROM WITHIN THE DECOMPRESSED DIRECTORY**
```
sudo cp -R * /usr/local/
```
Verify successful installation with
```
node -v 	(As of Nov. 2019, should output v12.13.1)
npm -v 		(As of Nov. 2019, should output 6.2.1)
```

Install dependencies
```
sudo apt-get update
sudo apt-get install git libudev-dev
```

To enable compatibility support with Bluetooth node libraries, run the following to switch to node v5.9.1
```
sudo npm install -g n
sudo n 5.9.1
```



## 3. Config Std. Bluetooth Services
Need to stop the default Bluetooth from running as usual.

```
sudo systemctl stop bluetooth
sudo systemctl status bluetooth
```

`sudo systemctl status bluetooth` should present the following
```
● bluetooth.service - Bluetooth service
   Loaded: loaded (/lib/systemd/system/bluetooth.service; enabled)
   Active: inactive (dead) since Mon 2016-04-04 06:58:30 UTC; 4s ago
     Docs: man:bluetoothd(8)
 Main PID: 584 (code=exited, status=0/SUCCESS)
   Status: "Quitting"
```
Now reactivate BLE using
```
sudo hciconfig hci0 up
```

The above must be run every time the Pi boots. For permanently stopping the Daemon, using the following command. **DO NOT DO THIS UNLESS READY FOR FINAL CONFIG**
```
sudo systemctl disable bluetooth
```
