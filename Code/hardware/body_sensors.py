import time
import board
import adafruit_dht
import psutil
import serial
import requests
import sys
sys.path.append(r"home/pi/Desktop/project-team-2/Code/hardware/max30102")

from heartrate_monitor import HeartRateMonitor

SERVER_HOST = '192.168.43.142'
#SERVER_HOST = '172.27.51.182'

SERVER_URL = f'http://{SERVER_HOST}:8000/api/v1'

PATIENT_ID = 1

def send_post_data_to_server(path, data):
    url = f"{SERVER_URL}/{path}/"
    
    data['patient'] = PATIENT_ID
    try:
        r = requests.post(url, data=data)
        print(r.status_code)
        if r.status_code // 100 == 2:
            print("data sent to server")
        else:
            print(r.content)
    except Exception as e:
        print("failed to send data", e)

def get_temperature(sensor):
    a = sensor.readline()
    print(a)
    p = float(a.decode().strip())
    return p

if __name__ == "__main__":
                             
    hrm = HeartRateMonitor(print_raw=False, print_result=False)
    hrm.start_sensor()

    temp_sensor = serial.Serial('/dev/ttyUSB0')

    while True:
        try:
            bpm = hrm.bpm
            spo2 = hrm.spo2
  #          temp = get_temperature(temp_sensor)
            temp = 37 
 
            print(f"bpm: {bpm}   spo2: {spo2}    temp: {temp}")

            data = {
               'oxygen_saturation':spo2 if not spo2 else round(spo2, 2),
                'heart_rate': int(bpm), # TODO FLOAT SERVER
               'body_temperature': temp,
                }
            send_post_data_to_server('records', data)
            
        except RuntimeError as error:
            print(error.args[0])
            time.sleep(2.0)
            continue
        except Exception as error:
            hrm.stop_sensor()
            temp_sensor.close()
            print(error)
            raise error

        time.sleep(1.0)