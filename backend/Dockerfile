FROM python:3

RUN pip install pipenv

ENV PROJECT_DIR /app
COPY . ${PROJECT_DIR}
WORKDIR ${PROJECT_DIR}

RUN pipenv install --system --deploy

CMD ["pipenv", "run", "flask", "--app", "server", "run", "-h", "0.0.0.0"]