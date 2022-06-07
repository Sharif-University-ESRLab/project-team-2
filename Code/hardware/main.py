from send_values import send_values
from store_arduino_values import store_values
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

    sleep(10)
    print("sending values...")
    # This thread will read arduino values from files and
    # send them to server along with raspberry sensor values
    send_values()

if __name__ == "__main__":
    run()
