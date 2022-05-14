from datetime import datetime

from lark import T
import serial

def write_to_file(file_name, value):
    with open(file_name, 'w') as f:
        f.write(value)
        f.flush()


if __name__ == "__main__":
    arduino = serial.Serial('/dev/ttyUSB0')
    line = arduino.readline().decode().strip()

    type_, val = line.split(',')

    t = datetime.timestamp()

    write_to_file(f"values/{type_}", f"{t},{val}")
