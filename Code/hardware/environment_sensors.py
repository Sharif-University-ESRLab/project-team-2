import time
import board
import adafruit_dht
import psutil
import serial
import requests


SERVER_URL = 'http://172.27.51.182:8000/api/v1'

PATIENT_ID = 1

def send_post_data_to_server(path, data):
    url = f"{SERVER_URL}/{path}/"
    
    data['patient'] = PATIENT_ID
    try:
        r = requests.post(url, data=data)
        print(r.status_code)
        if r.status_code == 200:
            print("data sent to server")
    except Exception:
        print("failed to send data")

def init():
    # We first check if a libgpiod process is running. If yes, we kill it!
    for proc in psutil.process_iter():
        if proc.name() == 'libgpiod_pulsein' or proc.name() == 'libgpiod_pulsei':
            proc.kill()

def get_temperature_and_humidity(sensor):
    temp = sensor.temperature
    humidity = sensor.humidity
    return temp, humidity

def get_pollution(sensor):
    p = int(sensor.readline().decode().strip())
    return p

if __name__ == "__main__":
                             
    dht11_sensor = adafruit_dht.DHT11(board.D23)
    mq135_sensor = serial.Serial('/dev/ttyUSB0')
    
    while True:
        try:
            temperature, humidity = get_temperature_and_humidity(dht11_sensor)
            pollution = get_pollution(mq135_sensor)
 
            print(f"Temperature: {temperature}*C   Humidity: {humidity} Pollution: {pollution}")

            data = {
                'air_pollution': pollution,
                'environment_temperature': temperature,
                'relative_humidity': humidity
                }
            send_post_data_to_server('records', {'patient': 1, 'ecg': 230})
            
        except RuntimeError as error:
            print(error.args[0])
            time.sleep(2.0)
            continue
        except Exception as error:
            dht11_sensor.exit()
            mq135_sensor.close()
            raise error

        time.sleep(1.0)