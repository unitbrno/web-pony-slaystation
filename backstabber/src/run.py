from flask_restless import APIManager

from app import FlaskApp, DB
from models import EventRecord, Record, Category


# create database
DB.create_all()

# flask-restless API manager.
manager = APIManager(FlaskApp, flask_sqlalchemy_db=DB)

# API DB endpoints
manager.create_api(EventRecord, methods=['GET', 'POST', 'PUT', 'DELETE'])
manager.create_api(Record, methods=['GET', 'POST', 'PUT', 'DELETE'])
manager.create_api(Category, methods=['GET', 'POST', 'PUT', 'DELETE'])


@FlaskApp.route('/', methods=['GET'])
def get_albums() -> str:
    """ Welcome message """
    return 'Welcome to Pony Staystation, a place where no pony is safe. *EVIL LAUGHTER*'


# start the flask loop
FlaskApp.run(host="0.0.0.0")
