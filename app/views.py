"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
import jwt

from flask.helpers import send_from_directory
from app import app, db, login_manager
from flask import json, jsonify, render_template, request, redirect, url_for, flash, session, abort, g
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from app.forms import NewCar, RegisterForm, LoginForm, SearchForm
from app.models import *
from datetime import datetime
from functools import wraps
from sqlalchemy import and_

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated

###
# Routing for your application.
###

@app.route('/api/register', methods=['POST'])
def register():
    form = RegisterForm()
    current_dt = datetime.now()
    if form.validate_on_submit():
        print('ONE')
        image = form.photo.data
        filename = secure_filename(image.filename)
        user = Users(username = form.username.data, password = form.password.data, name = form.name.data,
        email = form.email.data, location = form.location.data, biography = form.biography.data,
        photo = filename, date_joined = current_dt.strftime("%Y-%m-%d " + "%X"))
        db.session.add(user)
        db.session.commit()
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        flash('User Successfully registered', 'success')
        return json.jsonify(username = form.username.data, name = form.name.data, photo = filename,
        email = form.email.data, location = form.location.data, biography = form.biography.data,
        date_joined = current_dt.strftime("%Y-%m-%d " + "%X"))

@app.route('/api/auth/login', methods=['POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.username.data:
            username = form.username.data
            password = form.password.data
            user = Users.query.filter_by(username=username).first()
            if user is not None and check_password_hash(user.password, password):
            # get user id, load into session
                login_user(user)
                flash('User Successfully logged in', 'success')
    
                payload = {
                    'username': username,
                    'password': password
                }
                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
                return json.jsonify(status=200, token = token)
            else:
                flash('Username or Password is incorrect.', 'danger')

@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    print('arrived')
    logout_user()
    print('uers logged out')
    flash('Log out successful', 'danger')
    return json.jsonify(status=200)

@app.route('/api/cars',methods = ['GET','POST'])
@requires_auth
def cars():
    form = NewCar()
    if request.method == 'GET':
        response = []
        cars = Cars.query.all()
        for i in range(len(cars)):
            car = cars[i]
            response.append({'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type, 'price':car.price,'photo':car.photo,'user_id':car.user_id})
          
        return jsonify(response)
    
    elif form.validate_on_submit():
        image = form.photo.data
        filename = secure_filename(image.filename)
        car = Cars(description = form.description.data, make = form.make.data, model = form.model.data,
        colour = form.colour.data, year = form.year.data, transmission = form.transmission.data, car_type = form.car_type.data,
        price = form.price.data, photo = filename, user_id = form.user_id.data)
        db.session.add(car)
        db.session.commit()
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        flash('Car Successfully added', 'success')
        return jsonify(id = car.id, description = form.description.data, make = form.make.data, model = form.model.data,
        colour = form.colour.data, year = form.year.data, transmission = form.transmission.data, car_type = form.car_type.data,
        price = form.price.data, photo = filename, user_id = form.user_id.data)

@app.route('/api/cars/<car_id>',methods=['GET'])
@requires_auth
def carDetails(car_id):
    car = Cars.query.get(car_id)
    response={'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type, 'price':car.price, 'photo':car.photo,'user_id':car.user_id}
    return jsonify(response)



@app.route('/api/cars/<car_id>/favourite', methods = ['POST'])
@requires_auth
def favourite(car_id):
    print('gotin')
    user_id = current_user.get_id() # place holder
    fav = Favourites(car_id,user_id)
    try:
        db.session.add(fav)
        db.session.commit()
        response = {'message':'Favourite sucessfully added'}
    except:
        response = {'message':'An Error has occured'}

    return jsonify(response)

@app.route('/api/search', methods = ['GET'])
@requires_auth
def search():
    response = []
    arg1 = request.args.get('searchformake')
    arg2 = request.args.get('searchformodel')
    if arg1 and arg2:
        one = arg1
        two = arg2
        cars = Cars.query.filter(and_(Cars.make == one, Cars.model==two)).all()
        for i in range(len(cars)):
            car = cars[i]
            response.append({'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type, 'price':car.price,'photo':car.photo,'user_id':car.user_id})
            
        return jsonify(response)

    elif arg1:
        make = arg1
        cars = Cars.query.filter_by(make = make).all()
        for i in range(len(cars)):
            car = cars[i]
            response.append({'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type, 'price':car.price,'photo':car.photo,'user_id':car.user_id})
            
        return jsonify(response)
        

    elif arg2:
        model = arg2
        cars = Cars.query.filter_by(model = model).all()
        for i in range(len(cars)):
            car = cars[i]
            response.append({'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type, 'price':car.price,'photo':car.photo,'user_id':car.user_id})
            
        return jsonify(response)

    else:
        print('none')
        flash("Please fill out at least one of the fields", 'danger')



@app.route('/api/users/<user_id>', methods=['GET'])
@requires_auth
def userDetails(user_id):
    user=Users.query.get(user_id)
    response={'id':user.id, 'username':user.username, 'name':user.name, 'email':user.email, 'location':user.location, 'biography': user.biography, 'photo':user.photo, 'date_joined': user.date_joined }
    return jsonify(response)

@app.route('/api/users/<user_id>/favourites', methods=['GET'])
@requires_auth
def usersFav(user_id):
    response = []
    cars = db.session.query(Favourites, Cars).select_from(Cars).join(Favourites).filter(Favourites.user_id==user_id).all()
    for fav, car in cars:
        print(car.id)
        response.append({'id':car.id,'description':car.description, 'make':car.make, 'model': car.model, 'colour':car.colour, 'year':car.year, 'transmission':car.transmission, 'car_type':car.car_type, 'price':car.price,'photo':car.photo} )
    return jsonify(response)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

@app.route('/uploads/<filename>')
def get_image(filename):
    root_dir = os.getcwd()
    return send_from_directory(os.path.join(root_dir,app.config['UPLOAD_FOLDER']),filename)

    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
