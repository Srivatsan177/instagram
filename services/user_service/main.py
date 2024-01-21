from fastapi import FastAPI
from core.decorators.mongo_db_helper import mongo_wrapper
from core.models.User import User
from routes.login import router as login_router
from routes.user import router as user_router
from mongoengine import connect, disconnect
import os

app = FastAPI()

app.include_router(login_router)
app.include_router(user_router)


@app.on_event("startup")
def connect_mongo():
    connect(
        db=os.environ["MONGO_DB_NAME"],
        username=os.environ["MONGO_DB_USER"],
        password=os.environ["MONGO_DB_PASS"],
        host=os.environ["MONGO_DB_HOST"],
    )


@app.on_event("shutdown")
def disconnect_mongo():
    disconnect()
