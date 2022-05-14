from time import sleep

with open("tmp",'r') as f:
    while True:
        print(f.read())
        sleep(1)
