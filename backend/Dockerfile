FROM python:3


ENV PROJECT_DIR /app

COPY . ${PROJECT_DIR}
WORKDIR ${PROJECT_DIR}

RUN pip install pipenv && \
    pipenv install --system --deploy

CMD ["flask", "run"]