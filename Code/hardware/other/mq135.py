import serial
dev = serial.Serial('/dev/ttyUSB0')
try:
    while True:
        print(dev.readline())
except Exception:
    dev.close()
