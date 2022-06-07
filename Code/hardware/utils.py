
DEBUG = False

SERVER_HOST = '192.168.43.142'

SERVER_URL = f'http://{SERVER_HOST}:8000/api/v1'

PATIENT_ID = 1 # default

VALUES_DIR = 'sensor_values'


def dprint(*args):
    """
    Print only if in DEBUG mode
    """
    if DEBUG:
        print(*args)
