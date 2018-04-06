import { Component } from '@angular/core';
import {AgmMarker, LatLng, LatLngLiteral} from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // google maps zoom level
  zoom = 14;

  // initial center position for the map
  coordinates = { lat: 49.194964, lng: 16.608786 };

  tripPlaces: MarkerInter[] = [];
  dir = undefined;

  index = 4;

  markers: MarkerInter[] = [
    {
      coordinates: <LatLngLiteral>{ lat: 49.1923233, lng: 16.6089141 },
      draggable: false,
      id: 1,
      categories: ['architecture', 'tour'],
      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Brno_Zeln%C3%BD_trh_a_Ditrich%C5%A1tejn_ve%C4%8Der_5.jpg/1280px-Brno_Zeln%C3%BD_trh_a_Ditrich%C5%A1tejn_ve%C4%8Der_5.jpg',
      description: 'Náměstí s trhem, kašnou, sousoším a dvěma divadly.',
      name: 'Zelný trh'
    },
    {
      coordinates: <LatLngLiteral>{ lat: 49.1910184, lng: 16.6074144 },
      draggable: false,
      id: 2,
      categories: ['underground'],
      photoUrl: 'http://itras.cz/fotogalerie/katedrala-sv-petra-a-pavla-brno/velke/katedrala-sv-petra-a-pavla-brno-lukas-lhotecky-001.jpg',
      description: 'Nepřehlédnutelná dominanta se tyčí na kopci zvaném Petrov.',
      name: 'Katedrála sv. Petra a Pavla'
    },
    {
      coordinates: <LatLngLiteral>{ lat: 49.1944928, lng: 16.599177 },
      draggable: false,
      id: 3,
      categories: ['nature', 'tour'],
      photoUrl: 'https://www.mistopisy.cz/modules/pruvodce/media/interest/412/interest.jpg',
      description: 'Rozlehlý komplex na vrcholu stejnojmenného kopce.',
      name: 'Hrad Špilberk'
    }
  ];

  activeMarker = null;

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

  addToTrip(m: MarkerInter, content): void {
    if(this.isInTrip(m.id)) {
      this.tripPlaces = this.tripPlaces.filter(item => item.id !== m.id);
    } else {
      this.tripPlaces = [...this.tripPlaces, m];
    }
    this.updateIcon(m);
    content.close();
  }

  isInTrip(id: number): boolean{
    return this.tripPlaces.findIndex(tripId => tripId.id === id) !== -1;
  }

  focusPlace(m: MarkerInter): void {
    this.coordinates = m.coordinates;
  }

  removePlace(m: MarkerInter, event: MouseEvent): void {
    this.tripPlaces = this.tripPlaces.filter(item => item.id !== m.id);
    this.updateIcon(m);
    event.stopPropagation();
  }

  private updateIcon(m: MarkerInter): void {
    const marker = this.markers.find(mark => mark.id === m.id);
    const index = this.tripPlaces.findIndex(mark => mark.id === m.id);
    if (index >= 0) {
      marker.iconUrl = 'assets/' + marker.categories[0] + '_selected.png';
    } else {
      marker.iconUrl = 'assets/' + marker.categories[0] + '.png';
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
interface MarkerInter {
  coordinates: LatLngLiteral;
  label?: any;
  draggable: boolean;
  id: number;
  name: string;
  description: string;
  categories: string[];
  photoUrl: string;
  iconUrl?: string;
}

