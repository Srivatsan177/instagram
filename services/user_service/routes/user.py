import redis
from fastapi import APIRouter, Depends, HTTPException
from typing_extensions import Annotated
from core.utils.auth import get_user
from core.models.User import User, UserFollow
from core.schemas.UserSchema import UserProfile, UpdateUserSchema, UserImageName, MinifiedUserInfo
from lib.s3_utils import get_pre_signed_url
from lib.schemas.user_schema import FollowerCount
from http import HTTPStatus
import os
import boto3
import json
from core.utils.redis import get_redis_client

router = APIRouter(prefix="/users")
FOLLOW_QUEUE_URL = os.environ["SQS_QUEUE_FOLLOW_URL"]

@router.get("/info/")
def user_info(current_user: Annotated[User, Depends(get_user)]) -> UserProfile:
    user = User.objects.filter(id=current_user.id).first()
    if user.image_location is None:
        image_location = get_pre_signed_url("default", "user.jpg", "get")
    else:
        image_location = get_pre_signed_url(str(user.id), user.image_location, "get")
    user_profile = UserProfile(
        username=user.username,
        image_s3_url=image_location,
        name=user.name,
        dob=user.dob.strftime("%Y-%m-%d"),
        phone_number=user.phone_number,
        email=user.email,
    )
    return user_profile

@router.get("/info/{user_id}")
def minified_user_info(user_id: str, current_user: Annotated[User, Depends(get_user)]) -> MinifiedUserInfo:
    user = User.objects.filter(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="User not found")
    if user.image_location is None:
        image_location = get_pre_signed_url("default", "user.jpg", "get")
    else:
        image_location = get_pre_signed_url(str(user.id), user.image_location, "get")
    user_follow = UserFollow.objects.filter(user_id=user_id, follower_id=current_user.id).first()
    if user_follow is None:
        user_follow = False
    else:
        user_follow = True
    return MinifiedUserInfo(id=str(user.id), username=user.username, image_s3_url=image_location, following=user_follow, own_user=str(user_id) == str(current_user.id))




@router.put("/")
def update_user_info(updated_user: UpdateUserSchema, current_user: Annotated[User, Depends(get_user)]) -> bool:
    user = User.objects.filter(id=current_user.id).first()
    user.name = updated_user.name
    user.dob = updated_user.dob
    user.phone_number = updated_user.phone_number
    user.email = updated_user.email
    user.save()
    return True

@router.put("/image")
def update_user_image(image_info: UserImageName, current_user: Annotated[User, Depends(get_user)]) -> str:
    return get_pre_signed_url(str(current_user.id), image_info.image_name, "put")

@router.put("/image-success")
def update_user_image_success(image_info: UserImageName, current_user: Annotated[User, Depends(get_user)]) -> bool:
    print(current_user)
    user = User.objects.filter(id=current_user.id).first()
    user.image_location = image_info.image_name
    user.save()
    return True

@router.post("/follow/{user_id}")
def follow_user(user_id: str, current_user: Annotated[User, Depends(get_user)]) -> bool:
    user_follow = UserFollow.objects.filter(user_id=user_id, follower_id=current_user.id).first()
    sqs_client = boto3.client("sqs")
    if user_follow is None:
        user_follow = UserFollow(user_id=user_id, follower_id=current_user.id)
        user_follow.save()
        sqs_client.send_message(
            QueueUrl=FOLLOW_QUEUE_URL,
            MessageBody=json.dumps({"user_id": user_id, "follower_id": str(current_user.id), "count": 1}),
        )
        return True
    user_follow.delete()
    user_follow.save()
    sqs_client.send_message(
            QueueUrl=FOLLOW_QUEUE_URL,
            MessageBody=json.dumps({"user_id": user_id, "follower_id": str(current_user.id), "count": -1}),
        )
    return False

@router.get("/follower-following-count/{user_id}")
def follower_following_count(user_id: str, current_user: Annotated[User, Depends(get_user)], redis_client: Annotated[redis.Redis, Depends(get_redis_client)]) -> FollowerCount:
    follower_count = redis_client.get(f"follower:{user_id}")
    following_count = redis_client.get(f"following:{user_id}")
    return FollowerCount(follower_count = follower_count if following_count is not None else 0, following_count=following_count if following_count is not None else 0)
