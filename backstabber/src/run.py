from flask import after_this_request
from flask_restless import APIManager

from app import FlaskApp, DB, ValidationError
from models import EventRecord, Record

# create database
DB.create_all()


def allow_control_headers(**kw):
    """ !!! CORS !!! """

    @after_this_request
    def add_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response


# flask-restless API manager.
manager = APIManager(
    FlaskApp,
    flask_sqlalchemy_db=DB,
    preprocessors=dict(
        POST=[allow_control_headers],
        GET_SINGLE=[allow_control_headers],
        GET_MANY=[allow_control_headers],
        PATCH_SINGLE=[allow_control_headers],
        PATCH_MANY=[allow_control_headers],
        PUT_SINGLE=[allow_control_headers],
        PUT_MANY=[allow_control_headers],
        DELETE_SINGLE=[allow_control_headers],
        DELETE_MANY=[allow_control_headers],
    )
)

# API DB endpoints
manager.create_api(
    EventRecord,
    methods=['GET', 'POST', 'PUT', 'DELETE'],
    validation_exceptions=[ValidationError],
)

manager.create_api(
    Record,
    methods=['GET', 'POST', 'PUT', 'DELETE'],
    validation_exceptions = [ValidationError],
)


@FlaskApp.route('/', methods=['GET'])
def get_albums() -> str:
    """ Welcome message """
    return 'Welcome to Pony Staystation, a place where no pony is safe. *EVIL LAUGHTER*'


# start the flask loop
FlaskApp.run(host="0.0.0.0")
