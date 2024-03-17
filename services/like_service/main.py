from dotenv import load_dotenv
load_dotenv("../../.env")

from redis import Redis
import os
from dataclasses import dataclass
import json
import boto3
import schedule
import time
from mongoengine import connect
from core.models.Image import Image, ImageLike as ImageLikeModel

like_queue_url = os.environ["SQS_QUEUE_LIKE_URL"]
delete_queue_url = os.environ["SQS_QUEUE_DELETE_URL"]
bucket_name = os.environ["S3_BUCKET_NAME"]
follow_queue_url = os.environ["SQS_QUEUE_FOLLOW_URL"]

@dataclass
class ImageLike:
    image_id: str
    like_count: int

@dataclass
class FollowerCount:
    user_id: str
    follower_id: str
    count: int

def get_likes(r:Redis):
    print("reading like queue")
    sqs_client = boto3.client('sqs')
    response = sqs_client.receive_message(
        QueueUrl=like_queue_url,
        MaxNumberOfMessages=10,  # Maximum number of messages to retrieve
        WaitTimeSeconds=0  # Don't wait for messages if none are available
    )

    # Process the received messages
    for message in response.get('Messages', []):
        print(message)
        image_like = ImageLike(**json.loads(message['Body']))
        # Your message processing logic here
        r.incrby(f"image_like:{image_like.image_id}", image_like.like_count)
        # Delete the message after processing
        sqs_client.delete_message(
            QueueUrl=like_queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )

def follower_count(r:Redis):
    print("Reading follow queue")
    sqs_client = boto3.client('sqs')
    response = sqs_client.receive_message(
        QueueUrl=follow_queue_url,
        MaxNumberOfMessages=10,  # Maximum number of messages to retrieve
        WaitTimeSeconds=0  # Don't wait for messages if none are available
    )
    # Process the received messages
    for message in response.get('Messages', []):
        print(message)
        follower = FollowerCount(**json.loads(message['Body']))
        # Your message processing logic here
        r.incrby(f"follower:{follower.user_id}", follower.count)
        r.incrby(f"following:{follower.follower_id}", follower.count)
        # Delete the message after processing
        sqs_client.delete_message(
            QueueUrl=follow_queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )


def delete_all(r:Redis):
    print('viewing delete queue')
    def delete_s3(image_id):
        image = Image.objects.filter(id=image_id).first()
        image_key = f"images/{image_id}/{image.image_location}"
        s3_client = boto3.client("s3")
        s3_client.delete_object(
            Bucket=bucket_name,
            Key=image_key,
        )

        
    def delete_redis(image_id):
        r.delete(f"image_like:{image_id}")

    def delete_mongo_record(image_id):
        def delete_image_like():
            image_likes = ImageLikeModel.objects.filter(image_id=image_id)
            for image_like in image_likes:
                image_like.delete()
                image_like.save()
        def delete_image():
            image = Image.objects.filter(id=image_id).first()
            image.delete()
            image.save()
        delete_image_like()
        delete_image()

    sqs_client = boto3.client('sqs')
    response = sqs_client.receive_message(
        QueueUrl=delete_queue_url,
        MaxNumberOfMessages=10,  # Maximum number of messages to retrieve
        WaitTimeSeconds=0  # Don't wait for messages if none are available
    )

    # Process the received messages
    for message in response.get('Messages', []):
        image_id = json.loads(message["Body"])["image_id"]
        delete_s3(image_id)
        delete_redis(image_id)
        delete_mongo_record(image_id)       

        sqs_client.delete_message(
            QueueUrl=delete_queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )
        
        


if __name__ == "__main__":
    r = Redis(host=os.environ["REDIS_HOST"],port=os.environ["REDIS_PORT"],password=os.environ["REDIS_PASS"],username=os.environ["REDIS_USER"])
    schedule.every(5).seconds.do(get_likes, r=r)
    schedule.every(5).seconds.do(delete_all, r=r)
    schedule.every(5).seconds.do(follower_count, r=r)
    connect(
        db=os.environ["MONGO_DB_NAME"],
        host=os.environ["MONGO_DB_HOST"],
        username=os.environ["MONGO_DB_USER"],
        password=os.environ["MONGO_DB_PASS"],
    )
    while True:
        schedule.run_pending()
        time.sleep(1)