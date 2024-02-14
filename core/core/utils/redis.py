from dotenv import load_dotenv
load_dotenv("../../../.env")
import redis
import os
def get_redis_client():
    return redis.Redis(host=os.environ["REDIS_HOST"],port=os.environ["REDIS_PORT"],password=os.environ["REDIS_PASS"],username=os.environ["REDIS_USER"])