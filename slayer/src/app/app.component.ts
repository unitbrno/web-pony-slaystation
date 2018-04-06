import { Component } from '@angular/core';
import { LatLngLiteral, MapTypeStyle } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { PlaceModel } from './place.model';
import { PlacesService } from './places.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // google maps zoom level
  zoom = 14;

  // initial center position for the map
  coordinates = {lat: 49.194964, lng: 16.608786};

  tripPlaces: PlaceModel[] = [];
  dir = undefined;

  markers: PlaceModel[] = [];

  activeMarker = null;

  someRange = [1900, 2018];

  config: any = {
    connect: true,
    range: {
      min: 1000,
      max: 2018
    },
    step: 100,
    pips: {
      mode: 'steps',
      density: 20
    },
    tooltips: [true, true],
  };

  toolbarVisible = true;
  readonly style: Promise<MapTypeStyle[]>;

  constructor(private http: HttpClient, private placeSerives: PlacesService) {
    this.style = this.http.get<MapTypeStyle[]>('assets/map-config.json').toPromise<MapTypeStyle[]>();
    this.placeSerives.places$.subscribe(
      (data: PlaceModel[]) => {
        this.markers = data;
      }
    );
  }

  clickedMarker(content) {
    if (this.activeMarker) {
      this.activeMarker.close();
      this.activeMarker = content !== this.activeMarker ? content : null;
    } else {
      this.activeMarker = content;
    }
    if (this.activeMarker) {
      this.activeMarker.open();
    }
  }

  mapClicked($event: MouseEvent) {
    if (this.activeMarker) {
      this.activeMarker.close();
    }
  }

  addToTrip(m: PlaceModel, content): void {
    if (this.isInTrip(m.id)) {
      this.tripPlaces = this.tripPlaces.filter(item => item.id !== m.id);
    } else {
      this.tripPlaces = [...this.tripPlaces, m];
    }
    this.updateIcon(m);
    content.close();
  }

  isInTrip(id: number): boolean {
    return this.tripPlaces.findIndex(tripId => tripId.id === id) !== -1;
  }

  focusPlace(m: PlaceModel): void {
    this.coordinates = m.coordinates;
  }

  removePlace(m: PlaceModel, event: MouseEvent): void {
    this.tripPlaces = this.tripPlaces.filter(item => item.id !== m.id);
    this.updateIcon(m);
    event.stopPropagation();
  }

  private updateIcon(m: PlaceModel): void {
    const marker = this.markers.find(mark => mark.id === m.id);
    const index = this.tripPlaces.findIndex(mark => mark.id === m.id);
    if (index >= 0) {
      marker.iconUrl = 'assets/' + marker.category_list[0] + '_selected.png';
    } else {
      marker.iconUrl = 'assets/' + marker.category_list[0] + '.png';
    }
  }

  planTrip() {
    console.log(this.tripPlaces.map(place => place.coordinates));
    this.dir = {
      origin: this.directionStart,
      destination: this.directionEnd,
      waypoints: this.tripPlaces
        .filter(item =>
          item.coordinates !== this.directionEnd
          && item.coordinates !== this.directionStart
        )
        .map(
          place => {
            return {
              location: place.coordinates,
              stopover: true
            };
          })
    };
  }

  get directionStart(): LatLngLiteral {
    return (this.tripPlaces && this.tripPlaces.length > 1)
      ? this.tripPlaces[0].coordinates
      : null;
  }

  get directionEnd(): LatLngLiteral {
    return (this.tripPlaces && this.tripPlaces.length > 1)
      ? this.tripPlaces[this.tripPlaces.length - 1].coordinates
      : null;
  }
}

// just an interface for type safety.
export interface MarkerInter {
  coordinates: LatLngLiteral;
  label?: any;
  id: number;
  name: string;
  description: string;
  categories: string[];
  photo_url: string;
  iconUrl?: string;
}

