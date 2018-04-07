from pprint import pprint

from flask import after_this_request, request, make_response, jsonify
from flask_restless import APIManager
from flask_cors import cross_origin

from app import FlaskApp, DB, ValidationError
from handlers import get_clusters, Point
from models import EventRecord, Record

from googlemaps import Client
from googlemaps.directions import directions

GMAPS_KEY = 'AIzaSyBAq7Y7h9YFZuhgfAXsORx68R9hKRyeoaU'


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
@cross_origin()
def clusterize() -> dict:
    def valid_point(d):
        if not 'latitude' in d.keys() or not 'longitude' in d.keys():
            return False
        return True

    def point_eq(p1, p2):
        return p1['latitude'] == p2['latitude'] and p1['longitude'] == p2['longitude']

    def cluster_eq(c1, c2):
        return c1['coords']['lat'] == c2['coords']['lat'] and c2['coords']['lon'] == c1['coords']['lon']

    def find_cluster(p, clist):
        for c in clist:
            for pp in c['points']:
                if point_eq(p, pp):
                    return c
        raise Exception('Something went very wrong')

    data = request.json or request.get_json()
    if not data:
        raise ValidationError(errors=dict(objects='empty request'))
    points = data.get('objects', [])
    if len(points) < 1:
        raise ValidationError(errors=dict(objects='cannot clusterize 0 points'))

    for p in points:
        if not valid_point(p):
            raise ValidationError(
                errors=dict(objects='all points must have at least latitude and longitude attributes'))
    clusters = get_clusters(points=points, max_dist=500)

    gmaps_client: Client = Client(key=GMAPS_KEY)

    origin_cluster = find_cluster(points[0], clusters)
    dest_cluster = find_cluster(points[-1], clusters)
    waypoint_clusters = [c for c in clusters if (not cluster_eq(c, origin_cluster)) and (not cluster_eq(c, dest_cluster))]
    waypoints = ["{},{}".format(c['coords']['lat'], c['coords']['lon']) for c in waypoint_clusters]

    # Request directions via public transit
    dirs = directions(
        client=gmaps_client,
        origin="{},{}".format(origin_cluster['coords']['lat'], origin_cluster['coords']['lon']),
        destination="{},{}".format(dest_cluster['coords']['lat'], dest_cluster['coords']['lon']),
        waypoints=waypoints,
        mode="walking",
        optimize_waypoints=True
    )

    ordered = [origin_cluster]
    waypoint_clusters_points = [(c, Point(lat=c['coords']['lat'], lon=c['coords']['lon'])) for c in waypoint_clusters]

    for leg in dirs[0]['legs']:
        dest = leg['steps'][-1]['end_location']
        dest = Point(lat=dest['lat'], lon=dest['lng'], payload=dest)

        if not waypoint_clusters_points:
            continue

        best_match = 0
        best_diff = Point.distance(dest, waypoint_clusters_points[best_match][1])
        for i, c in enumerate(waypoint_clusters_points):
            diff = Point.distance(dest, c[1])
            if best_diff > diff:
                best_match = i
                best_diff = diff

        ordered.append(waypoint_clusters_points[best_match][0])
        del waypoint_clusters_points[best_match]

    ordered.append(dest_cluster)

    return make_response(jsonify(dict(clusters=ordered)))


# start the flask loop
FlaskApp.run(host="0.0.0.0")
