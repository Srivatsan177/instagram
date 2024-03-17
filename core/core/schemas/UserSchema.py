import typing

from pydantic import BaseModel


class UserProfile(BaseModel):
    username:str
    image_s3_url: str

    name: str
    dob: str
    phone_number: str
    email: str
    username: str

class UpdateUserSchema(BaseModel):
    name: str
    dob: str
    phone_number: str
    email: str

class UserImageName(BaseModel):
    image_name: str

class MinifiedUserInfo(BaseModel):
    id: str
    username: str
    image_s3_url: str
    following: bool
    own_user: typing.Optional[bool] = False