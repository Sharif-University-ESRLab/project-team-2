FROM python:3.10.4-slim-bullseye

WORKDIR /app

LABEL maintainer="amirmahdi.namjoo1@gmail.com"
LABEL description="Development image for the Health Monitor System"
LABEL authors="Amirmahdi Namjoo - Saba Hashemi - Alireza Tajmirriahi"

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get -y install default-libmysqlclient-dev gcc

RUN pip install --upgrade pip

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY . /app
