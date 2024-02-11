from dotenv import load_dotenv

load_dotenv("../../.env")
from fastapi import FastAPI
from mongoengine import connect, disconnect
from routes.images import router as image_router
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.include_router(image_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def connect_mongo():
    connect(
        db=os.environ["MONGO_DB_NAME"],
        host=os.environ["MONGO_DB_HOST"],
        username=os.environ["MONGO_DB_USER"],
        password=os.environ["MONGO_DB_PASS"],
    )


@app.on_event("shutdown")
def disconnect_mongo():
    disconnect()
