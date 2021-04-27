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
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.name=name
        self.email=email
        self.location=location 
        self.biography=biography
        self.photo=photo
        self.date_joined=date_joined

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)

class Favourites(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    car_id=db.Column(db.Integer,db.ForeignKey(Cars.id))
    user_id=db.Column(db.Integer,db.ForeignKey(Users.id))


    def __init__(self, car_id, user_id):
        self.car_id=car_id
        self.user_id=user_id
