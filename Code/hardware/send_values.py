from heartrate_monitor import HeartRateMonitor
import time
import board
import adafruit_dht
import psutil
import requests
import sys
sys.path.append(r"home/pi/Desktop/project-team-2/Code/hardware/max30102")

VALUES_DIR = 'sensor_values'

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
            print("Data sent to server successfully.")
        else:
            print("Server respond with none success status code. Error",  r.content)
    except Exception as e:
        print("Failed to send data, error:", e)


def get_temperature(f):
    line = f.readline()
    if not line:
        return None
    t, p = line.split(',')

    return float(p)


def get_ecg(f):
    line = f.readline()
    if not line:
        return None
    t, p = line.split(',')

    if '!' in p:
        return None
    
    return int(p)


def get_pollution(f):
    line = f.readline()
    if not line:
        return None

    t, p = line.split(',')

    return int(p)


def get_temperature_and_humidity(sensor):
    temp = sensor.temperature
    humidity = sensor.humidity
    return temp, humidity


def init():
    # Get patient id
    global PATIENT_ID
    with open('patient_id.txt') as f:
        line = f.readline()
        if line and line.isalnum:
            PATIENT_ID = int(line)
    
    # Check if any proccess from previous runs are still alive
    for proc in psutil.process_iter():
        if proc.name() == 'libgpiod_pulsein' or proc.name() == 'libgpiod_pulsei':
            proc.kill()


def send_values():
    init()

    # start heart rate sensor
    hrm = HeartRateMonitor(print_raw=False, print_result=False)
    hrm.start_sensor()

    # start environment temperutare and humidity sensor
    dht11_sensor = adafruit_dht.DHT11(board.D23)
    
    # open body temperature file 
    temp_file = open(f'{VALUES_DIR}/temp', 'r')

    # open ecg file
    ecg_file = open(f'{VALUES_DIR}/ecg', 'r')

    # open pollution file
    pollution_file = open(f'{VALUES_DIR}/pollution', 'r')

    while True:
        try:
            # read sensor values
            bpm = hrm.bpm
            spo2 = hrm.spo2
            temp = get_temperature(temp_file)
            ecg = get_ecg(ecg_file)
            temperature, humidity = get_temperature_and_humidity(dht11_sensor)
            pollution = get_pollution(pollution_file)

            # print values
            print(f"Temperature: {temperature}*C \tHumidity: {humidity} \tPollution: {pollution}")
            print(f"bpm: {bpm} \tspo2: {spo2} \ttemp: {temp} \tecg: {ecg}")

            # send values to server
            data = {
                'oxygen_saturation': spo2 if not spo2 else round(spo2, 2),
                'heart_rate': bpm if not bpm else int(bpm),  # TODO FLOAT SERVER
                'body_temperature': temp,
                'ecg': ecg,
                'air_pollution': pollution,
                'environment_temperature': temperature,
                'relative_humidity': humidity
            }
            send_post_data_to_server('records', data)

        except RuntimeError as error:
            print(error.args[0])
            time.sleep(2.0)
            continue
        except Exception as error:
            print(error)

            # close sensors and files
            hrm.stop_sensor()
            temp_file.close()
            ecg_file.close()
            dht11_sensor.exit()
            pollution_file.close()
            raise error

        time.sleep(1.0)


if __name__ == "__main__":
    send_values()
