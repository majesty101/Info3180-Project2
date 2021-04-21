"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
import jwt

from flask.helpers import send_from_directory
from app import app, db
from flask import json, jsonify, render_template, request, redirect, url_for, flash, session, abort
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from app.forms import RegisterForm, LoginForm
from app.models import Users
from datetime import datetime
from functools import wraps

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
        image = form.photo.data
        filename = secure_filename(image.filename)
        user = Users(username = form.username.data, password = form.password.data, name = form.name.data,
        email = form.email.data, location = form.location.data, biography = form.biography.data,
        photo = filename, date_joined = current_dt.strftime("%Y-%m-%d " + "%X"))
        db.session.add(user)
        db.session.commit()
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        flash('User Successfully registered', 'success')
        redirect(url_for("login"))
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
                redirect(url_for("cars1"))
                payload = {
                    'username': username,
                    'password': password
                }
                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
                return json.jsonify(message="Login Succesful", token = token)
            else:
                flash('Username or Password is incorrect.', 'danger')

@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    flash('Log out successful', 'danger')
    app.send_static_file('index.html')
    return json.jsonify(message="Log out successful")

"""
@app.route('/api/cars', methods=['GET'])
@requires_auth
def cars1():

@app.route('/api/cars', methods=['POST'])
@requires_auth
def cars2():

@app.route('/api/cars/{car_id}', methods=['GET'])
@requires_auth
def cars3():

@app.route('/api/cars/{car_id}/favourite', methods=['POST'])
@requires_auth
def cars_favs():

@app.route('/api/search', methods=['GET'])
@requires_auth
def search():

@app.route('/api/users/{user_id}', methods=['GET'])
@requires_auth
def users():

@app.route('/api/users/{user_id}/favourites', methods=['GET'])
@requires_auth
def users_favs():
"""










@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return app.send_static_file('index.html')


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


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
