from flask_wtf import FlaskForm
from wtforms import TextAreaField, StringField, PasswordField, DecimalField, IntegerField
from wtforms.validators import DataRequired, Email, InputRequired
from flask_wtf.file import FileField, FileRequired, FileAllowed


class RegisterForm(FlaskForm):
    username = StringField('Username', validators = [DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    name = StringField('Name', validators = [DataRequired()])
    email = StringField('Email', validators = [DataRequired(), Email()])
    location = StringField('Location', validators = [DataRequired()])
    biography = TextAreaField('Biography', validators = [DataRequired()])
    photo = FileField('Image', validators=[FileRequired(), FileAllowed(['jpg', 'png'], "Please check format, only PNG and JPG images are allowed!")])

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])


class NewCar(FlaskForm):
    year = IntegerField('Year', validators=[DataRequired()])
    make = StringField('Make', validators=[DataRequired()])
    model = StringField('Model', validators=[DataRequired()])
    colour = StringField('Colour', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    transmission = StringField('Transmission', validators=[DataRequired()])
    car_type = StringField('Car Type', validators=[DataRequired()])
    price = DecimalField('Price', validators=[DataRequired()])
    photo = FileField('Photo', validators=[FileRequired(), FileAllowed(['jpg', 'png'], "Please check format, only PNG and JPG images are allowed!")])

class SearchForm(FlaskForm):
    make = StringField('Make', validators=[DataRequired()])
    model = StringField('Model', validators=[DataRequired()])