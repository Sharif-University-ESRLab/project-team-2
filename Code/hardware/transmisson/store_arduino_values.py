from datetime import datetime
import os
import serial
import shutil
from utils.utils import dprint, VALUES_DIR, ARDUINO_PORT

write_flag = True

def write_to_file(file_name, value):
    """
    Write a value to file
    """

    global write_flag
    mode = 'w' if write_flag else 'a'
    write_flag = False

    with open(file_name, mode) as f:
        f.write(value)
        f.write("\n")
        f.flush()
        
        dprint(f"filename: {file_name} value: {value}")


def store_values():
    """
    Read sensor values from arduino and store each in seperate file
    """

    try:
        shutil.rmtree(VALUES_DIR)
    except FileNotFoundError:
        pass

    os.mkdir(VALUES_DIR)

    arduino = serial.Serial(ARDUINO_PORT)
    arduino.reset_input_buffer()
    while True:
        try:
            # read from arduino serial
            line = arduino.readline().decode().strip()
            dprint(f"line: {line}")
            # skip empty values
            if not line:
                continue

            # store each sensor values to seperate file
            type_, val = line.split(',')
            # skip empty values
            if not val:
                continue

            t = datetime.now().timestamp()
            write_to_file(f"{VALUES_DIR}/{type_}", f"{t},{val}")
        except Exception as e:
            print("error:", e)


if __name__ == "__main__":
    store_values()
