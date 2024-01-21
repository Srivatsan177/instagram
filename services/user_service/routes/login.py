import datetime
import traceback

from fastapi import APIRouter, HTTPException
from lib.schemas.user_schema import UserCreateSchema, JWTResponseSchema, UserLoginSchema
from core.decorators.mongo_db_helper import mongo_wrapper
from core.models.User import User
from core.utils.auth import hash_str, encode_data
from mongoengine.errors import NotUniqueError
from http import HTTPStatus

router = APIRouter(prefix="/auth")


@router.post(
    "/sign_up/",
)
def sign_up(user_info: UserCreateSchema) -> JWTResponseSchema:
    user = User(
        name=user_info.name,
        dob=user_info.dob,
        phone_number=user_info.phone_number,
        email=user_info.email,
        username=user_info.username,
        password=hash_str(user_info.password),
    )
    try:
        user.save()
    except NotUniqueError:
        raise HTTPException(
            status_code=HTTPStatus.METHOD_NOT_ALLOWED,
            detail=f"Username with {user_info.username} already exists",
        )
    except Exception:
        traceback.print_stack()
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error please try again after sometime",
        )

    user_dict = {
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "user_id": str(user.id),
    }
    access_token, refresh_token = encode_data(user_dict), encode_data(
        user_dict, exp_timer=datetime.timedelta(days=7)
    )
    return JWTResponseSchema(access_token=access_token, refresh_token=refresh_token)


@router.post("/login/")
def login(user_info: UserLoginSchema) -> JWTResponseSchema:
    hash_password = hash_str(user_info.password)
    user = User.objects(username=user_info.username).first()
    if user is None or user.password != hash_password:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="Username or Password incorrect"
        )
    user_dict = {
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "user_id": str(user.id),
    }
    access_token, refresh_token = encode_data(user_dict), encode_data(
        user_dict, exp_timer=datetime.timedelta(days=7)
    )
    return JWTResponseSchema(access_token=access_token, refresh_token=refresh_token)
