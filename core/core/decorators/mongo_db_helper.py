# Not used anywhere

from mongoengine import connect, disconnect
from functools import wraps
import os


def mongo_wrapper(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        connect(
            db=os.environ["MONGO_DB_NAME"],
            username=os.environ["MONGO_DB_USER"],
            password=os.environ["MONGO_DB_PASS"],
            host=os.environ["MONGO_DB_HOST"],
        )
        res = fn(*args, **kwargs)
        disconnect()
        return res

    return wrapper
