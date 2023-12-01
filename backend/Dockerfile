FROM python:3.10-alpine


ENV PROJECT_DIR /app

COPY . ${PROJECT_DIR}
WORKDIR ${PROJECT_DIR}

RUN pip install pipenv && \
    pipenv install --system --deploy

EXPOSE 5000

CMD ["flask", "run"]