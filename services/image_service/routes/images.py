from dotenv import load_dotenv

load_dotenv("../../.env")
import typing

from fastapi import APIRouter, Depends, HTTPException
from core.schemas.ImageSchema import (
    ImageCreateSchema,
    ImageCreateResponseSchema,
    ImageCreateSuccessSchema,
    ImageSchema,
    ImageLikeSchema,
)
from core.utils.auth import get_user
from core.utils.redis import get_redis_client
from core.models.Image import Image, ImageLike
from lib.utils.s3_util import get_pre_signed_url
from http import HTTPStatus
import boto3
import os
import json
import redis

like_queue_url = os.environ["SQS_QUEUE_LIKE_URL"]
delete_queue_url = os.environ["SQS_QUEUE_DELETE_URL"]

router = APIRouter(prefix="/images")


@router.get("")
def get_images(
    page: int = 0, limit: int = 5, current_user=Depends(get_user)
) -> typing.List[ImageSchema]:
    images = Image.objects.filter(is_deleted=False).order_by("-id")[page * limit : (page + 1) * limit]
    images = [
        ImageSchema(
            id=str(image.id),
            image_url=get_pre_signed_url(
                str(image.id),
                image.image_location,
                image.image_location.split(".")[1],
                "get",
            ),
            caption=image.caption,
            liked_by_user=True
            if ImageLike.objects.filter(
                user_id=str(current_user.id), image_id=str(image.id)
            ).first()
            is not None
            else False,
            own_user=str(image.user_id) == str(current_user.id)
        )
        for image in images
    ]
    return images


@router.get("/like-count/")
def get_likes(
    image_ids: str, redis_client: redis.Redis = Depends(get_redis_client)
) -> typing.List[ImageLikeSchema]:
    resp = []
    for image_id in image_ids.split(","):
        like_count = redis_client.get(f"image_like:{image_id}")
        resp.append(
            ImageLikeSchema(
                image_id=image_id,
                like_count=like_count if like_count is not None else 0,
            )
        )
    return resp


@router.get("/get-image/{image_id}")
def get_image(image_id: str, current_user=Depends(get_user)) -> ImageSchema:
    image = Image.objects(id=image_id).first()
    if image is None:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Image not found")
    presigned_url = get_pre_signed_url(
        str(image.id), image.image_location, image.image_location.split(".")[1], "get"
    )
    return ImageSchema(caption=image.caption, image_url=presigned_url)


@router.post("/post-image")
def post_image(
    image_info: ImageCreateSchema, current_user=Depends(get_user)
) -> ImageCreateResponseSchema:
    image_full_name, image_name, image_ext = (
        image_info.image_name,
        image_info.image_name.split(".")[0],
        image_info.image_name.split(".")[1],
    )
    if image_ext not in ["png", "jpeg", "jpg"]:
        raise HTTPException(
            status_code=HTTPStatus.METHOD_NOT_ALLOWED,
            detail=f"{image_ext} type of files are not yet supported",
        )
    image = Image(
        image_location=image_full_name,
        caption=image_info.caption,
        user_id=current_user.id,
    )
    image.save()
    image_put_presigned_url = get_pre_signed_url(
        str(image.id), image_full_name, image_ext, "put"
    )
    return ImageCreateResponseSchema(
        presigned_url=image_put_presigned_url, image_id=str(image.id)
    )


@router.post("/post-image-success")
def post_image_success(image_info: ImageCreateSuccessSchema) -> str:
    image = Image.objects.filter(id=image_info.image_id).first()
    if image is None:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Image not found")
    image.visible = True
    image.save()
    return "Image uploaded successfully"

@router.delete("/{image_id}")
def delete_image(image_id: str, current_user=Depends(get_user)) -> bool:
    image = Image.objects.filter(id=image_id).first()
    if image is None:
        raise HTTPException(HTTPStatus.NOT_FOUND, detail="Image not found")
    if str(image.user_id) != str(current_user.id):
        raise HTTPException(HTTPStatus.METHOD_NOT_ALLOWED, detail="Not owner of the image")
    
    sqs_client = boto3.client("sqs")
    sqs_client.send_message(
            QueueUrl=delete_queue_url,
            MessageBody=json.dumps({"image_id": image_id}),
        )
    image.deleted = True
    image.save()
    return True


@router.post("/like-image/{image_id}")
def like_image(image_id: str, current_user=Depends(get_user)) -> bool:
    sqs_client = boto3.client("sqs")

    image_like = ImageLike.objects.filter(
        image_id=image_id, user_id=str(current_user.id)
    ).first()
    if image_like is None:
        image_like = ImageLike(image_id=image_id, user_id=str(current_user.id))
        image_like.save()
        sqs_client.send_message(
            QueueUrl=like_queue_url,
            MessageBody=json.dumps({"image_id": image_id, "like_count": 1}),
        )
        return True
    else:
        image_like.delete()
        image_like.save()
        sqs_client.send_message(
            QueueUrl=like_queue_url,
            MessageBody=json.dumps({"image_id": image_id, "like_count": -1}),
        )
        return False
