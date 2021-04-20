"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app
from flask import render_template, request, redirect, url_for, flash


###
# Routing for your application.
###

@app.route('/api/register', methods=['POST'])
def register():

@app.route('/api/auth/login', methods=['POST'])
def login():

@app.route('/api/auth/logout', methods=['POST'])
def logout():

@app.route('/api/cars', methods=['GET'])
def cars1():

@app.route('/api/cars', methods=['POST'])
def cars2():

@app.route('/api/cars/{car_id}', methods=['GET'])
def cars3():

@app.route('/api/cars/{car_id}/favourite', methods=['POST'])
def cars_favs():

@app.route('/api/search', methods=['GET'])
def search():

@app.route('/api/users/{user_id}', methods=['GET'])
def users():

@app.route('/api/users/{user_id}/favourites', methods=['GET'])
def users_favs():









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
