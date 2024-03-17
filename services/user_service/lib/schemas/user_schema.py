import datetime

from pydantic import BaseModel


class UserCreateSchema(BaseModel):
    name: str
    dob: datetime.date
    phone_number: str
    email: str
    username: str
    password: str


class UserLoginSchema(BaseModel):
    username: str
    password: str


class JWTResponseSchema(BaseModel):
    access_token: str
    refresh_token: str

class FollowerCount(BaseModel):
    follower_count: int
    following_count: int
