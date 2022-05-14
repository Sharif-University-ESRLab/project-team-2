from time import sleep

with open("tmp",'w') as f:
    i = 0
    while True:
        f.write(f"-{i}")
        f.flush()
        print(i)
        i += 1
        sleep(0.1)
