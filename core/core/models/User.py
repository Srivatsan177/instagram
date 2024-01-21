from mongoengine import Document, StringField, DateField


class User(Document):
    name = StringField(required=True)
    dob = DateField()
    phone_number = StringField(required=True)
    email = StringField(required=True)
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
