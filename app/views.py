"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app
from app.models import *
from flask import render_template, request, redirect, url_for, flash ,jsonify
import os, datetime


###
# Routing for your application.
###

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



@app.route('/api/cars',methods = ['GET','POST'])
def cars():
    if request.method == 'GET':
        response = []
        cars = Cars.query.all()
        for i in range(len(cars)):
            car = cars[i]
            response.append({i:{'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type,'photo':car.photo,'user_id':car.user_id}})
          
        return jsonify(response)
    
    elif request.method == 'POST':
        #Code for adding a new car goes here. Need forms.py 
        return ('code for adding cars')



@app.route('/api/cars/<car_id>',methods=['GET'])
def carDetails(car_id):
    car = Cars.query.get(car_id)
    response={'id':car.id,'description':car.description,'make':car.make,'model':car.model,'colour':car.colour,'year':car.year,'transmission':car.transmission,'car_type':car.car_type,'photo':car.photo,'user_id':car.user_id}
    return jsonify(response)




@app.route('/api/cars/<car_id>/favourite',methods = ['POST'])
def favourite(car_id):
    user_id = 1 # place holder
    fav = Favourites(car_id,user_id)
    try:
        db.session.add(fav)
        db.session.commit()
        response = {'message':'Favourite sucessfully added'}
    except:
        response = {'message':'An Error has occured'}

    return jsonify(response)

@app.route('/api/users/<user_id>', methods=['GET'])
def userDetails(user_id):
    user=Users.query.get(user_id)
    response={'id':user.id, 'username':user.username, 'name':user.name, 'email':user.email, 'location':user.location, 'biography': user.biography, 'photo':user.photo, 'date_joined': user.date_joined }
    return jsonify(response)

@app.route('/api/users/<user_id>/favourites', methods=['GET'])
def usersFav(user_id):
    fav=Favourites.query.get(user_id)
    carmodel= Cars.query.get(user_id)

    response ={'id':fav.id, 'car_id': fav.car_id, 'user_id':fav.user_id, 'description':carmodel.description, 'make':carmodel.make, 'model': carmodel.model, 'colour':carmodel.colour, 'year':carmodel.year, 'transmission':carmodel.transmission, 'car_type':carmodel.car_type,'photo':carmodel.photo }
    return jsonify(response)
