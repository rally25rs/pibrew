## Pins

To determine the GPIO Pin number to put in `config.json` see:

(http://wiringpi.com/pins/special-pin-functions/)[http://wiringpi.com/pins/special-pin-functions/]

(http://elinux.org/images/archive/5/5c/20150701194103%21Pi-GPIO-header.png)[http://elinux.org/images/archive/5/5c/20150701194103%21Pi-GPIO-header.png]

## Temp Sensors

Enable 1wire following the guide:
https://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/

```
sudo nano /boot/firmware/config.txt
```

add

```
dtoverlay=w1-gpio
```

To get sensor IDs, use the command:

```
ls -l /sys/bus/w1/devices/
```

One 4.7k resistor is used as a pull-up.

## Relays

For relay circuit, see:

(http://www.susa.net/wordpress/2012/06/raspberry-pi-relay-using-gpio/)[http://www.susa.net/wordpress/2012/06/raspberry-pi-relay-using-gpio/]

(http://www.raspberrypi-spy.co.uk/2012/06/control-led-using-gpio-output-pin/)[http://www.raspberrypi-spy.co.uk/2012/06/control-led-using-gpio-output-pin/]

Uses a BC547B NPN transistor and a 22K resistor.

## Pi Setup

Had to turn off wifi adapter power management to prevent the network connection
from sleeping after a long idle period:
[http://raspberrypi.stackexchange.com/questions/1384/how-do-i-disable-suspend-mode/4518#4518](http://raspberrypi.stackexchange.com/questions/1384/how-do-i-disable-suspend-mode/4518#4518)

```
cat /sys/module/8192cu/parameters/rtw_power_mgnt
```

A value of 0 means disabled, 1 means min. power management, 2 means max. power
management. To disable this, you need to create a new file:

```
sudo nano /etc/modprobe.d/8192cu.conf
```

and add the following:

```
# Disable power management

options 8192cu rtw_power_mgnt=0
```

Once you save the file and reboot your RPi, the WiFi should stay on
indefinitely.

# install libraries for native GPIO

```
sudo apt install gpiod libgpiod2 libgpiod-dev libnode-dev
```

# install NodeJS

https://github.com/nodesource/distributions?tab=readme-ov-file#installation-instructions-deb
