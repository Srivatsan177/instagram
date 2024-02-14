from mongoengine import (
    Document,
    StringField,
    IntField,
    ListField,
    BooleanField,
    ObjectIdField,
)


class Image(Document):
    image_location = StringField(required=True)
    caption = StringField(max_length=1024)
    tags = ListField()
    likes = IntField(default=0)
    visible = BooleanField(default=False)
    user_id = ObjectIdField()


class ImageLike(Document):
    image_id=StringField(required=True, unique=True)
    user_id=StringField(required=True, unique=True)
