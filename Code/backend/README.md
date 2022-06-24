# Backend code


## Prerequisites

- You need to have Docker installed on your system. Also, port 8000 must be free. Port can be configured in [`docker-compose.yml`](./docker-compose.yml)
- To facilitate the process of running Docker and different commands, we use Makefile. So you need to have `make` on your system.

    - Ubuntu:
    `sudo apt-get install build-essential`

    - Windows:
    Multiple solutions exist. Including installing ["Make for Windows"](http://gnuwin32.sourceforge.net/packages/make.htm), or using [Chocolatey](https://chocolatey.org/install) package manager.

    - Mac:
    You can install it by installing Xcode or using `brew install make`.




## Make Commands


```make
make build
```
This command is used for the initial build of the backend container. You must run this at the first start of the backend code.


```make
make up
```
Runs the docker container that hosts backend code. The code must be built beforehand.


```make
make down
```
Stop the backend code.

```make
make logs
```
Shows docker logs.


```make
make makemigrations
```
Create Django migrations on the Docker container. It should be run after adding or editing Database models.

```make
make migrate
```
Apply migrations on the Database.


```make
make runserver
```
Runs the Django server.

```make
make shell
```
Gives you access to the Python shell inside the container.





For regular usage, running `make build` the first time and running `make up` and `make runserver` for other times should be enough.