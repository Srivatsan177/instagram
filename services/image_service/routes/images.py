from fastapi import APIRouter, Depends, HTTPException
from core.schemas.ImageSchema import (
    ImageCreateSchema,
    ImageCreateResponseSchema,
    ImageCreateSuccessSchema,
    ImageSchema,
)
from core.utils.auth import get_user
from core.models.Image import Image
from lib.utils.s3_util import get_pre_signed_url
from http import HTTPStatus

router = APIRouter(prefix="/images")


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
