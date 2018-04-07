import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LatLngLiteral} from '@agm/core';
import {createClient, DirectionsRequest} from '@google/maps';

@Injectable()
export class GoogleDirectionsService {

  googleMapsClient = null;

  constructor() {
    this.googleMapsClient = createClient({
      key: 'AIzaSyBAq7Y7h9YFZuhgfAXsORx68R9hKRyeoaU',
      Promise: Promise
    });
  }


  public getDirections() {

    const request = {
      origin: 'Chicago, IL',
      destination: 'Los Angeles, CA',
      waypoints: [
      {
        location: 'Joplin, MO',
        stopover: false
      }, {
        location: 'Oklahoma City, OK',
        stopover: true
      }],
      provideRouteAlternatives: false,
      travelMode: 'DRIVING',
      drivingOptions: {
      departureTime: new Date(/* now, or future date */),
        trafficModel: 'pessimistic'
    }
    };
    return this.googleMapsClient.directions(request)
      .asPromise();
  }
}
