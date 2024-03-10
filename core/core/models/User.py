from mongoengine import Document, StringField, DateField, ObjectIdField


class User(Document):
    name = StringField(required=True)
    dob = DateField()
    phone_number = StringField(required=True)
    email = StringField(required=True)
    username = StringField(required=True, unique=True)
    password = StringField(required=True)

    image_location=StringField(required=False)


class UserFollow(Document):
    user_id = ObjectIdField(required=True)
    follower_id = ObjectIdField(required=True, unique_with="user_id")