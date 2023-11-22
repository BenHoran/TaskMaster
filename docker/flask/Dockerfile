FROM python:3

WORKDIR /usr/src/app

COPY ../../backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.ext

COPY ../../backend/server.py .

CMD ["python", "server.py"]