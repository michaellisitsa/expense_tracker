FROM node:14.18.3-alpine

WORKDIR /nodebuild
ADD reactapp /nodebuild

RUN npm install && npm run build

# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
EXPOSE 8000
COPY . /code/
COPY --from=0 /nodebuild/build /code/reactapp/build
CMD [ "python", "./manage.py", "runserver", "0.0.0.0:8000"]