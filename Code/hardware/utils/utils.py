
DEBUG = False

SERVER_HOST = '192.168.43.142'

SERVER_URL = f'http://{SERVER_HOST}:8000/api/v1'

PATIENT_ID = 1 # default

VALUES_DIR = '/home/pi/Desktop/project-team-2/Code/hardware/sensor_values'

ARDUINO_PORT = '/dev/ttyUSB0'

def dprint(*args):
    """
    Print only if in DEBUG mode
    """
    if DEBUG:
        print(*args)
