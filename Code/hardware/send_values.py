from heartrate_monitor import HeartRateMonitor
import time
import board
import adafruit_dht
import psutil
import requests
import sys
from utils import PATIENT_ID, SERVER_URL, VALUES_DIR, dprint

sys.path.append(r"home/pi/Desktop/project-team-2/Code/hardware/max30102")


def send_post_data_to_server(path, data):
    """
    Send sensor values to server
    """

    global PATIENT_ID

    url = f"{SERVER_URL}/{path}/"

    data['patient'] = PATIENT_ID
    try:
        r = requests.post(url, data=data)
        dprint(r.status_code)
        if r.status_code // 100 == 2:
            print("Data sent to server successfully.")
        else:
            print("Server respond with none success status code. Error",  r.content)
    except Exception as e:
        print("Failed to send data, error:", e)


def get_temperature(f):
    """
    Read body temperature value from file
    """
    line = f.readline()
    if not line:
        return None
    t, p = line.split(',')

    return float(p)


def get_ecg(f):
    """
    Read ECG value from file
    """
    line = f.readline()
    if not line:
        return None
    t, p = line.split(',')

    if '!' in p:
        return None
    
    return int(p)


def get_pollution(f):
    """
    Read air pollution value from file
    """
    line = f.readline()
    if not line:
        return None

    t, p = line.split(',')

    return int(p)


def get_temperature_and_humidity(sensor):
    """
    Read temperature and humidity values from dht11 sensor
    """
    temp = sensor.temperature
    humidity = sensor.humidity
    return temp, humidity


def init():
    """
    Set up patien id and delete unwanted processes
    """

    # Get patient id
    global PATIENT_ID
    with open('patient_id.txt') as f:
        line = f.readline()
        if line and line.isalnum:
            PATIENT_ID = int(line)
    
    # Check if any process from previous runs are still alive
    for proc in psutil.process_iter():
        if proc.name() == 'libgpiod_pulsein' or proc.name() == 'libgpiod_pulsei':
            proc.kill()


def send_values():
    """
    Read arduino values from files and send them to server 
    along with raspberry sensor values
    """

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
            dprint(error.args[0])
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
