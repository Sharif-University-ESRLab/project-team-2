# HealthX
The source code for the project is located in the [healthx](./healthx) folder. Here is the table of contents for ths document:
  
  - [Development](#development)
  - [EAS Build](#build)
  - [Installation](#installation)
  - [Documents](#documents)

<div align="center">
  <img width="300px" src="/Code/app/healthx/assets/android_icon.png" alt="Application icon"/>
</div>

## Development

Install Expo CLI:

```bash
npm install -g expo-cli
```

Install node dependencies:

```bash
npm i
```

Run backend server (thorough instructions are provided [here](/Code/backend)):

```bash
python manage.py runserver 0.0.0.0:8000
```

Don't forget to change the `baseURL` to the server endpoint in [this file](/Code/app/healthx/src/api/base.js).

Start the project:

```bash
cd healthx
expo start
```

### Toubleshoot

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

## Build

EAS Build is a new and rapidly evolving service, which we have used to build the application

First off, install EAS using:

```bash
npm install -g eas-cli
```

After logging in to your Expo account, you need to configure the project. The configuration is set in the [`eas.json`](/Code/app/healthx/eas.json) file.

Run the command below to start building the project:

```bash
eas build -p android --profile preview
```

A URL will then be shown which directs you to your Expo dashboard from which you can observe the process. Upon completion, you can directly download and install the `.apk` file on your device.

More instructions can be found [here](https://docs.expo.dev/build-reference/apk/).

## Installation
You can install the application using the `.apk` file which is created following the instructions above. Its name is `HWLab 002` and the icon looks just like the one on top of the page!

## Documents

[React Native Documents](https://reactnative.dev/docs/integration-with-existing-apps)
