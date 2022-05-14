from datetime import datetime
import os
import serial
import shutil

write_flag = True

def write_to_file(file_name, value):
    global write_flag
    mode = 'w' if write_flag else 'a'
    print(write_flag, mode)
    write_flag = False
    with open(file_name, mode) as f:
        f.write(value)
        f.write("\n")
        f.flush()
        print(f"filename: {file_name} value: {value}")

if __name__ == "__main__":
#    os.rmdir('values')
    
    shutil.rmtree('values')
    os.mkdir('values')

    arduino = serial.Serial('/dev/ttyUSB0')
    while True:
        try:
            line = arduino.readline().decode().strip()
            print("line:", line)
            if not line:
                continue
            type_, val = line.split(',')

            t = datetime.now().timestamp()

            write_to_file(f"values/{type_}", f"{t},{val}")
        except Exception as e:
            print("error:", e)

