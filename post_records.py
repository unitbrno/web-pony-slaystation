#!/usr/bin/env python3
import json
import sys

import requests

RECORDS_URL = "http://35.198.94.71:5000/api/record"
# RECORDS_URL = "http://0.0.0.0:5000/api/record"  # use this locally


def check_obj(obj):
    for key in obj.keys():
        if key not in ['name', 'description', 'latitude', 'longitude',
                       'time_period', 'price', 'photo_url', 'categories', 'link']:
            return False
    return True


if __name__ == '__main__':

    if len(sys.argv) != 2:
        raise Exception("pass path to valid json file as a second argument")

    f = open(sys.argv[1], 'r')
    data = json.loads(f.read())
    # pprint(data)

    if 'objects' not in data.keys():
        raise Exception("no top level objects key")

    bad_objects = []
    posted_count = 0

    for obj in data['objects']:
        if not check_obj(obj):
            bad_objects.append(obj)
        else:
            response = requests.post(RECORDS_URL, json=obj)
            if response.status_code != 201:
                bad_objects.append(obj)
            else:
                posted_count += 1

    print('Succesfully posted {}/{} records'.format(posted_count, len(data['objects'])))
    f.close()

    if bad_objects:
        print('Unposted object dumped into `malformed.json` file. Fix it and run it again.')
        m = open('malformed.json', 'w')
        m.write(str(json.dumps(
            dict(objects=bad_objects)
        )))
        m.close()
