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
git config --global user.email ucb.azaad@gmail.com
git config --global user.name "Azaad"
git config --global credential.helper store
git clone https://github.com/ajaymerchia/rpi-peripheral.git
```

For authentication, use `username: robinslight` and `password: RobinsLight.2020`.

You also need to setup the run time script.

```
cd ~
touch robinslight_start.sh
echo "cd /home/pi/wkspc/rpi-peripheral && sudo ./status red &" >> robinslight_start.sh
echo "cd /home/pi/wkspc/rpi-peripheral && sudo ./bleconfig" >> robinslight_start.sh
echo "cd /home/pi/wkspc/rpi-peripheral/server && sudo npm start" >> robinslight_start.sh
chmod +x robinslight_start.sh

cd ~
sudo nano /etc/rc.local
```

Inside rc.local comment out all lines before exit 0,  and add the following line right before exit 0:
```
sudo sh '/home/pi/robinslight_start.sh'
```
and then save and exit the file with :wq!
and run the following:
```
sudo chown root /etc/rc.local
sudo chmod 755 /etc/rc.local
```

Reference this if you get stuck: https://askubuntu.com/questions/9853/how-can-i-make-rc-local-run-on-startup

## 3. Setup Node & NPM
Run `uname -m` in terminal and you'll see what type of processor this Pi is equipped with.

Download the right package here: [https://nodejs.org/dist/v11.0.0/](https://nodejs.org/dist/v11.0.0/). Download the appropriate `.tar.gz` file based on architecture.
> Pi3 uses Linux Binaries (ARM) v7.0
> Pi Zero W uses Linux Binaries (ARM) v6.0l
>

Decompress the file using the archive utility, then install it using **FROM WITHIN THE DECOMPRESSED DIRECTORY**
```
sudo cp -R * /usr/local/
```
Verify successful installation with
```
node -v 	(Should output v11.0.0)
npm -v 		(Should output 6.4.1)
```

Install dependencies for RobinsLight
```
sudo apt-get update
sudo apt-get install git libudev-dev
```
To enable compatibility support with Bluetooth node libraries, run the following to switch to node v5.9.1

```
sudo npm install -g n
sudo n 5.9.1
```
## 4. Setup GPIO
To properly interface with the LED Strip and a Real Time Clock, please wire the GPIO terminals as follows.

**TURN OFF THE RASPBERRY PI AND DISCONNECT FROM POWER SOURCE PRIOR TO MODIFYING GPIO TERMINALS**

*Orient the Raspberry Pi such that the letters GPIO is facing to the left. Rotating the Pi 90° counter-clockwise should result in the letters being read normally*

	[to RTC.VCC, LED.+5V] 	○○
	[to RTC.SDA]			○○
	[to RTC.SCL]			○○
							○○
							○○

							○○ [to LED.DQ]
							○○
							○○
							○○
							○○

							○○
							○○
							○○
							○○
							○○

							○○
							○○
							○○
							○○
	[to RTC.GND, LED.GND]	○○


If everything is configured properly, on system boot, you should see a red light emanate from the clock, and (maybe) the LED strip will flash for a few milliseconds.

**If the Raspberry Pi refuses to boot, you probably have a loose connection. When developing, the ground wire was found to be the most problematic. Try better isolating this wire.**

## 5. Setup Real-Time Clock
### Enable I2C Hardware Interfaces
Unfortunately Raspberry Pis limit the out-of-the-box hardware options.

Run `sudo nano /boot/config.txt` to modify these options. Find the lines that resemble the following and uncomment the indicated line. Then save the file.
```
# Uncomment some or all of these to enable the optional hardware interfaces
#dtparam=i2c_arm=on <-- Uncomment This Line
#dtparam=i2s=on
#dtparam=spi=on
```



### Configure the Clock
#### Giving the Kernel Access to the Clock
First we check to see if the GPIO is wired correctly. Run `sudo i2cdetect -y 1`. If the GPIO was properly wired, you should see the number 68 in the terminal response.

Now we're going to load the clock hardware into the kernel using `sudo modprobe rtc-ds1307`.

Now we have to access the kernel directly to configure the clock. Run the following commands with super user privileges.

```
sudo bash
echo ds1307 0x68 > /sys/class/i2c-adapter/i2c-1/new_device
exit
```
#### Synchronizing the Clock
To check if the clock is operational, run `sudo hwclock -r`. You should get a date sometime near January 1st, 2000 if the clock is brand new. The value doesn't really matter.

**Make sure you have a working internet connection.** Run `date` to sync the Raspberry Pi with the internet's clock. Then, run `sudo hwclock -w` to store this correct time in the clock module.

Verify `sudo hwclock -r` returns the true time.

To make sure the time is correct each time the device boots, we have to edit 2 config files.
1. Run `sudo nano /etc/modules`, then add `rtc-ds1307` to the end of the file (after `i2c-dev`).
2. Run `sudo nano /etc/rc.local`, then, at the end of the file, before `exit 0`, add the following lines of code.
```
echo ds1307 0x68 /sys/class/i2c-adapter/i2c-1/new_device
sudo hwclock -s
date
```

Save both buffers and reboot the RaspberryPi using `sudo reboot`. On boot, verify that the time is correct.

## 6. Setup the Light Strip
Reopen `sudo nano /boot/config.txt` and add/uncomment the following lines.
```
hdmi_force_hotplug=1
hdmi_force_edid_audio=1
```
**Make sure you are in home (`cd ~`).** Run `curl -L http://coreelec.io/33 | bash` to download a sample library for using LEDs. Once it is done, test the library by running `sudo python rpi_ws281x/python/examples/strandtest.py -c`. Feel to `^C` when you're done being mesmerized.



## 7. Preparing Node Module Support (Start with Item 7)

So this is going to sound absolutely f*cking ridiculous and it kept me up until 5:45am, but for some reason the BLE library does not compile on the Pi Zero W architecture. To Resolve:
1. Run `sudo shutdown now` on the Raspberry Pi Zero W, and remove the MicroSD Card.
2. Insert the MicroSD Card into a Raspberry Pi3, navigate to `wkspc/rpi-peripheral/server` and execute `rm -rf node_modules`.
3. Run `npm install`. It should install a working copy of `bleno`.
4. Validate that the Pi3 architecture compiles by running `npm start`. The application should launch
5. Run `sudo shutdown now` and transfer the MicroSD card back to the Raspberry Pi Zero W. Disconnect and reconnect it to its power source
6. Run `npm start` in `wkspc/rpi-peripheral/server`, it should successfully boot now.

7. **Realize that your workaround doesn't actually work and the exact same code runs fine on a Raspberry Pi 3, but not on a Raspberry Pi Zero W.**

# Appendix
## Validating Std. Bluetooth Services
We need to stop the default Bluetooth from running as usual. This is accomplished on boot by `./bleconfig` in the `rpi-peripheral` repository. This is the more explicit validation.

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
