import serial
dev = serial.Serial('/dev/ttyUSB1')
print(dev.readline())
dev.close()