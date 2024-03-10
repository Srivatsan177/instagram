import os

import typing
import boto3

S3_BUCKET_NAME = os.environ["S3_BUCKET_NAME"]
S3_PREFIX_IMAGES = "users"
GET_OBJECT_EXPIRY = 60 * 60 * 12
PUT_OBJECT_EXPIRY = 60 * 5


def get_pre_signed_url(
    object_id: str,
    file_name: str,
    url_type: typing.Literal["put", "get"] = "get",
):
    s3_client = boto3.client("s3")
    return s3_client.generate_presigned_url(
        "put_object" if url_type == "put" else "get_object",
        Params={
            "Bucket": S3_BUCKET_NAME,
            "Key": f"{S3_PREFIX_IMAGES}/{object_id}/{file_name}",
            # "ContentType": f"image/{file_type}", # TODO: Fix this line
        },
        ExpiresIn=GET_OBJECT_EXPIRY if url_type == "get" else PUT_OBJECT_EXPIRY,
    )
