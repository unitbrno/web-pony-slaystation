import { Component } from '@angular/core';
import { AgmMarker } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // google maps zoom level
  zoom = 14;

  // initial center position for the map
  lat = 49.194964;
  lng = 16.608786;

  tripPlaces: MarkerInter[] = [];

  markers: MarkerInter[] = [
    {
      lat: 49.1923233,
      lng: 16.6089141,
      draggable: false,
      id: 1,
      iconUrl: 'assets/pnis2.png',
      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Brno_Zeln%C3%BD_trh_a_Ditrich%C5%A1tejn_ve%C4%8Der_5.jpg/1280px-Brno_Zeln%C3%BD_trh_a_Ditrich%C5%A1tejn_ve%C4%8Der_5.jpg',
      description: 'Náměstí s trhem, kašnou, sousoším a dvěma divadly.',
      name: 'Zelný trh'
    },
    {
      lat: 49.1910184,
      lng: 16.6074144,
      draggable: false,
      id: 2,
      iconUrl: 'assets/pnis2.png',
      photoUrl: 'http://itras.cz/fotogalerie/katedrala-sv-petra-a-pavla-brno/velke/katedrala-sv-petra-a-pavla-brno-lukas-lhotecky-001.jpg',
      description: 'Nepřehlédnutelná dominanta se tyčí na kopci zvaném Petrov.',
      name: 'Katedrála sv. Petra a Pavla'
    },
    {
      lat: 49.1944928,
      lng: 16.599177,
      draggable: false,
      id: 3,
      iconUrl: 'assets/pnis2.png',
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
    if(this.isInTrip(m.id)){
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
    this.lng = m.lng;
    this.lat = m.lat;
  }

  removePlace(m: MarkerInter, event: MouseEvent): void {
    this.tripPlaces = this.tripPlaces.filter(item => item.id !== m.id);
    this.updateIcon(m);
    event.stopPropagation();
  }

  private updateIcon(m: MarkerInter): void {
    const marker = this.markers.find(mark => mark.id === m.id);
    marker.iconUrl = marker.iconUrl === 'assets/pnis1.png' ? 'assets/pnis2.png' : 'assets/pnis1.png';
  }
}

// just an interface for type safety.
interface MarkerInter {
  lat: number;
  lng: number;
  label?: any;
  draggable: boolean;
  id: number;
  iconUrl: any;
  name: string;
  description: string;
  photoUrl: string;
}

