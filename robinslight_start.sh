# STATIC LIGHT BACKUP
# cd /home/pi/wkspc/rpi-peripheral && sudo ./status white 45 &

# ROBINOS
cd /home/pi/wkspc/rpi-peripheral && sudo ./status red &
cd /home/pi/wkspc/rpi-peripheral && sudo ./bleconfig
cp /home/pi/wkspc/rpi-peripheral/server/bleno_test.js /home/pi/wkspc/rpi-peripheral/server/node_modules/bleno/test.js
cd /home/pi/wkspc/rpi-peripheral/server && sudo npm start

# Advertising Config
# cd /home/pi/wkspc/rpi-peripheral/server/node_modules/bleno && sudo node test.js 
