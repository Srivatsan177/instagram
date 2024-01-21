import os

import jwt
from datetime import datetime, timedelta
from hashlib import md5
from fastapi.security import OAuth2PasswordBearer
from typing_extensions import Annotated
from fastapi import Depends, HTTPException
from http import HTTPStatus
from core.models.User import User

oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")


def encode_data(
    json_payload: dict, exp_timer: timedelta = timedelta(minutes=10)
) -> str:
    claim_time = datetime.utcnow()
    end_time = claim_time + exp_timer
    json_payload["exp"] = end_time
    json_payload["iat"] = claim_time
    return jwt.encode(json_payload, os.environ["JWT_SECRET"], algorithm="HS256")


def decode_data(jwt_str: str) -> dict:
    return jwt.decode(jwt_str, os.environ["JWT_SECRET"], algorithms="HS256")


def hash_str(str_to_hash: str):
    return md5(str_to_hash.encode("utf-8")).hexdigest()


def get_user(token: Annotated[str, Depends(oauth2_schema)]):
    try:
        decoded_token = decode_data(token)
        user = User.objects(id=decoded_token["user_id"]).first()
        if user is None:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED, detail="user not found in system"
            )
        return user
    except jwt.exceptions.ExpiredSignatureError:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="Login expired login again"
        )
    except Exception as e:
        raise e
