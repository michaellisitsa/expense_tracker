#!/bin/sh
gunicorn project.wsgi:application --bind 0.0.0.0:8000