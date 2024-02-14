FROM python:3.12-slim-bullseye

ENV POETRY_HOME=/opt/poetry
ENV PATH="$PATH:${POETRY_HOME}/bin"

WORKDIR /usr/app


COPY . .

RUN apt update && apt install -y curl && curl -sSL https://install.python-poetry.org | python3 -

# TODO Poetry code