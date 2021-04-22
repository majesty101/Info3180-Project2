from . import db
from werkzeug.security import generate_password_hash


class Cars(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    description =db.Column(db.String(255))
    make= db.Column(db.String(255))
    model=db.Column(db.String(255)) 
    colour=db.Column(db.String(255)) 
    year=db.Column(db.String(255))
    transmission=db.Column(db.String(255)) 
    car_type=db.Column(db.String(255))
    price=db.Column(db.Float)
    photo=db.Column(db.String())
    user_id=db.Column(db.Integer)


    def __init__(self, description, make, model, colour, year, transmission, car_type, price, photo, user_id):
        self.description=description
        self.make=make
        self.model = model
        self.colour=colour
        self.year=year
        self.transmssion=transmission
        self.car_type=car_type
        self.price = price
        self.photo=photo
        self.user_id=user_id




class Favourites(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    car_id=db.Column(db.Integer)
    user_id=db.Column(db.Integer)


    def __init__(self, car_id, user_id):
        self.car_id=car_id
        self.user_id=user_id

class Users(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(255))
    password=db.Column(db.String(255))
    name=db.Column(db.String(255)) 
    email=db.Column(db.String(255)) 
    location=db.Column(db.String(255)) 
    biography=db.Column(db.String(255)) 
    photo=db.Column(db.String(255))
    date_joined=db.Column(db.String(255))

    def __init__(self, username, password,name, email, location, biography, photo, date_joined):
        self.username=username
        self.password=password
        self.name=name
        self.email=email
        self.location=location 
        self.biography=biography
        self.photo=photo
        self.date_joined=date_joined
