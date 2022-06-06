from datetime import datetime
import os
import serial
import shutil

write_flag = True

VALUES_DIR = 'sensor_values'

def write_to_file(file_name, value):
    global write_flag
    mode = 'w' if write_flag else 'a'
    write_flag = False
    with open(file_name, mode) as f:
        f.write(value)
        f.write("\n")
        f.flush()
        print(f"filename: {file_name} value: {value}")


def store_signals():
    shutil.rmtree('sensor_values')
    os.mkdir('sensor_values')

    arduino = serial.Serial('/dev/ttyUSB0')
    arduino.reset_input_buffer()
    while True:
        try:
            # read from arduino serial
            line = arduino.readline().decode().strip()
            print("line:", line.encode())
            if not line:
                continue

            # store each sensor values to seperate file
            type_, val = line.split(',')
            t = datetime.now().timestamp()
            write_to_file(f"{VALUES_DIR}/{type_}", f"{t},{val}")
        except Exception as e:
            print("error:", e)


if __name__ == "__main__":
    store_signals()
