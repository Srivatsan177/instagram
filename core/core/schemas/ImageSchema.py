from pydantic import BaseModel


class ImageCreateSchema(BaseModel):
    image_name: str
    caption: str


class ImageCreateResponseSchema(BaseModel):
    presigned_url: str
    image_id: str


class ImageCreateSuccessSchema(BaseModel):
    image_id: str


class ImageSchema(BaseModel):
    id: str
    caption: str
    image_url: str
    like_count: int

class ImageLikeSchema(BaseModel):
    image_id: str
    like_count: int
