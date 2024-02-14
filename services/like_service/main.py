from dotenv import load_dotenv
load_dotenv("../../.env")

from redis import Redis
import os
from dataclasses import dataclass
import json
import boto3
import schedule
import time

queue_url = os.environ["SQS_QUEUE_LIKE_URL"]

@dataclass
class ImageLike:
    image_id: str
    like_count: int

def get_messages(r:Redis):
    print("reading queue")
    sqs_client = boto3.client('sqs')
    response = sqs_client.receive_message(
        QueueUrl=queue_url,
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
            QueueUrl=queue_url,
            ReceiptHandle=message['ReceiptHandle']
        )

if __name__ == "__main__":
    r = Redis(host=os.environ["REDIS_HOST"],port=os.environ["REDIS_PORT"],password=os.environ["REDIS_PASS"],username=os.environ["REDIS_USER"])
    schedule.every(1).minutes.do(get_messages, r=r)
    schedule.every(1).seconds.do(get_messages, r=r)
    while True:
        schedule.run_pending()
        time.sleep(1)