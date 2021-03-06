from transmisson.send_values import send_values
from transmisson.store_arduino_values import store_values
import threading

from time import sleep

def run():
    """
    Start capturing sensor values and sending them to server
    """

    print("start capturing...")

    # This thread will read values from arduino and store
    # each sensor value in one file.
    x = threading.Thread(target=store_values)
    x.start()
    print("capturing started.")
    
    # wait for arduino sensors to start
    sleep(5)

    print("sending values...")
    
    # This thread will read arduino values from files and
    # send them to server along with heartrate sensor values
    send_values()

if __name__ == "__main__":
    run()
