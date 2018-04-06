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

  index = 4;

  markers: MarkerInter[] = [
    {
      lat: 49.1923233,
      lng: 16.6089141,
      draggable: false,
      id: 1,
      iconUrl: 'assets/pnis2.png'
    },
    {
      lat: 49.1910184,
      lng: 16.6074144,
      draggable: false,
      id: 2,
      iconUrl: 'assets/pnis2.png'
    },
    {
      lat:  49.1944928,
      lng: 16.599177,
      draggable: false,
      id: 3,
      iconUrl: 'assets/pnis2.png'
    }
  ];

  clickedMarker(marker, m) {
    console.log('marker', m.iconUrl);
    const mm = this.markers.find(mark => mark.id === marker.id);

    mm.iconUrl = mm.iconUrl === 'assets/pnis1.png' ? 'assets/pnis2.png' : 'assets/pnis1.png';

    console.log('marker', marker.iconUrl);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: (<any>$event).coords.lat,
      lng: (<any>$event).coords.lng,
      draggable: false,
      id: this.index,
      iconUrl: 'assets/pnis2.png'

  });
    this.index = this.index + 1;
  }
}

// just an interface for type safety.
interface MarkerInter {
  lat: number;
  lng: number;
  label?: any;
  draggable: boolean;
  id: number;
  iconUrl: string;
}

