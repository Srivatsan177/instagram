FROM python:3.12-bullseye

ENV POETRY_HOME=/opt/poetry
ENV PATH="$PATH:${POETRY_HOME}/bin"

WORKDIR /usr/app

COPY . .

WORKDIR /usr/app/services/user_service

RUN apt update && \
apt install -y curl && \
curl -sSL https://install.python-poetry.org | python3 - && \
poetry install
ENTRYPOINT [ "python" ]