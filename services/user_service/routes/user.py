from fastapi import APIRouter, Depends
from typing_extensions import Annotated
from core.utils.auth import get_user
from core.models.User import User
import json

router = APIRouter(prefix="/user")


@router.get("/info/")
def user_info(current_user: Annotated[User, Depends(get_user)]):
    return {"current_user": json.loads(current_user.to_json())}
