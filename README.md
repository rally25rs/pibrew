== Pins

To determine the GPIO Pin number to put in `config.json` see:

(http://wiringpi.com/pins/special-pin-functions/)[http://wiringpi.com/pins/special-pin-functions/]

(http://elinux.org/images/archive/5/5c/20150701194103%21Pi-GPIO-header.png)[http://elinux.org/images/archive/5/5c/20150701194103%21Pi-GPIO-header.png]

== Temp Sensors

To get sensor IDs, use the command:

```
ls -l /sys/bus/w1/devices/
```

One 4.7k resistor is used as a pull-up.

== Relays

For relay circut, see:

(http://www.susa.net/wordpress/2012/06/raspberry-pi-relay-using-gpio/)[http://www.susa.net/wordpress/2012/06/raspberry-pi-relay-using-gpio/]

(http://www.raspberrypi-spy.co.uk/2012/06/control-led-using-gpio-output-pin/)[http://www.raspberrypi-spy.co.uk/2012/06/control-led-using-gpio-output-pin/]

Uses a BC547B NPN transistor and a 22K resistor.
