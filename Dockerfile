
# syntax=docker/dockerfile:1
FROM nikolaik/python-nodejs:python3.9-nodejs14
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
WORKDIR /code/reactapp
RUN npm install && npm run build
WORKDIR /code
EXPOSE 8000
COPY ./entrypoint.sh /code/
ENTRYPOINT ["sh","entrypoint.sh"]