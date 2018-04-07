from flask import after_this_request, request, make_response, jsonify
from flask_restless import APIManager

from app import FlaskApp, DB, ValidationError
from handlers import get_clusters
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
    validation_exceptions=[ValidationError],
)


@FlaskApp.route('/', methods=['GET'])
def welcome() -> str:
    """ Welcome message """
    return 'Welcome to Pony Staystation, a place where no pony is safe. *EVIL LAUGHTER*'


@FlaskApp.route('/clusterize', methods=['POST'])
def clusterize() -> dict:
    def valid_point(d):
        if not 'latitude' in d.keys() or not 'longitude' in d.keys():
            return False
        return True

    data = request.get_json()
    points = data.get('objects', [])
    if len(points) < 2:
        return make_response(jsonify(dict(clusters=[dict(points=points)])))

    for p in points:
        if not valid_point(p):
            raise ValidationError(
                errors=dict(objects='all points must have at least latitude and longitude attributes'))
    clusters = get_clusters(points=points, max_dist=250)
    return make_response(jsonify(dict(clusters=clusters)))


# start the flask loop
FlaskApp.run(host="0.0.0.0")
