FROM python:3.6
MAINTAINER Lukas Slouka "lukas.slouka@flowup.cz"

COPY . /app
WORKDIR /app

ENV PYTHONPATH /app/src

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000
