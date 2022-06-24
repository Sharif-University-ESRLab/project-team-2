# Hardware code

This README only includes essential info needed to run the code on Hardware. For more info about file and directory structures, refer to the [Final Document](../../Document/Report-Group-2-Final.pdf).

## Setup

### Arduino
- Deploy `arduino\main\main.ino` into Arduino.
- The variable `ARDUINO_PORT` in `utils\utils.py` must be set to the name of the USB port on Raspberry to which Arduino is connected.


### Install the packages:
- Create a python virtual environment:
```sh
python -m venv venv
. /venv/bin/activate
```
- Run this script:
```sh
python -m pip install -r requirements.txt
```

### Other perquisites

- Set server IP in `utils.py`.
- You must Store the patient ID in `patient_id.txt`. This file will have only one line with a number with it. This number will be used as a Patient ID.

### Run main code on Raspberry

- Run `main.py` on Raspberry Pi using the command below:

```sh
python main.py
```

## Development Notes

- You can activate the debug mode in `utils.py`.
