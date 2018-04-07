import { Component } from '@angular/core';
import { LatLngLiteral, MapTypeStyle } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { PlaceModel } from './place.model';
import { PlacesService } from './places.service';
import { MatSelectChange } from '@angular/material';
import * as moment from 'moment';
import {ClusterModel} from './cluster.model';


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

  walking_dirs = [];
  transit_dirs = [];

  originalPlaces: PlaceModel[] = [];
  filteredPlaces: PlaceModel[] = [];

  activeMarker = null;

  someRange = [1000, 2018];

  config: any = {
    connect: true,
    range: {
      min: 1000,
      max: 2018
    },
    step: 10,
    pips: {
      mode: 'range',
      density: 5
    },
    tooltips: [true, true],
  };

  readonly categories = [
    {
      label: 'Architektura',
      value: 'architecture'
    },
    {
      label: 'Hrady, kostely',
      value: 'castles_churches'
    },
    {
      label: 'Muzea, galerie, divadla',
      value: 'museums_galeries_theatres'
    },
    {
      label: 'Příroda',
      value: 'nature'
    },
    {
      label: 'Náměstí',
      value: 'square'
    },
    {
      label: 'Sochy',
      value: 'statue'
    },
    {
      label: 'Podzemí',
      value: 'underground'
    },
    {
      label: 'Prohlídky',
      value: 'tour'
    }
  ];

  selectedCategories: any[] = [];
  toolbarVisible = true;
  readonly style: Promise<MapTypeStyle[]>;

  first: PlaceModel = null;
  last: PlaceModel = null;

  constructor(private http: HttpClient, private placeService: PlacesService) {
    this.style = this.http.get<MapTypeStyle[]>('assets/map-config.json').toPromise<MapTypeStyle[]>();
    this.placeService.places$.subscribe(
      (data: PlaceModel[]) => {
        this.originalPlaces = data;
        this.filteredPlaces = data;
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
    const marker = this.originalPlaces.find(mark => mark.id === m.id);
    const index = this.tripPlaces.findIndex(mark => mark.id === m.id);
    if (index >= 0) {
      marker.iconUrl = 'assets/' + marker.category_list[0] + '_selected.png';
    } else {
      marker.iconUrl = 'assets/' + marker.category_list[0] + '.png';
    }
  }

  planTrip() {
    console.log(this.tripPlaces.map(place => place.coordinates));
    console.log('sorted', this.sortedTripPlaces);

    this.placeService.getClusters(this.sortedTripPlaces).subscribe(
      (data: ClusterModel[]) => {
        console.log(data);

        this.walking_dirs = [];
        this.transit_dirs = [];

        for (let i = 0; i < data.length - 1; i++) {
          this.transit_dirs.push({
            origin: <LatLngLiteral>{ lat: data[i].coords.lat, lng: data[i].coords.lon },
            destination: <LatLngLiteral>{ lat: data[i + 1].coords.lat, lng: data[i + 1].coords.lon }
          });

          if (data[i].points.length > 1) {
            this.walking_dirs.push({
              origin: <LatLngLiteral>{ lat: data[i].coords.lat, lng: data[i].coords.lon },
              destination: <LatLngLiteral>{ lat: data[i].coords.lat, lng: data[i].coords.lon },
              waypoints: data[i].points
                                .map(item => ({
                                    location: <LatLngLiteral>{ lat: item.latitude, lng: item.longitude },
                                    stopover: true
                                }))
            });
          }
        }
      }
    );
  }

  handleCategories(event: MatSelectChange): void {
    this.selectedCategories = event.value;
    this.filterPlaces();
  }

  handleTime(times: number[]): void {
    this.someRange = times;
    this.filterPlaces();
  }

  setStart(place: PlaceModel): void {
    this.first = place;
  }

  setEnd(place: PlaceModel): void {
    this.last = place;
  }

  private filterPlaces(): void {
    this.filteredPlaces = [...this.originalPlaces];
    if (this.selectedCategories.length !== 0) {
      this.filteredPlaces = this.originalPlaces.filter(item => item.category_list.some(category => this.selectedCategories.some(cat => cat === category)));
    }
    const start = moment(this.someRange[0], 'YYYY');
    const end = moment(this.someRange[1], 'YYYY');

    this.filteredPlaces = this.filteredPlaces.filter(place => {
      const time = moment(place.time_period, 'YYYY-m-d');
      return time.isSameOrBefore(end, 'years') && time.isSameOrAfter(start, 'years');
    });

    this.activeMarker = null;
  }

  get directionStart(): LatLngLiteral {
    return this.first ? this.first.coordinates : null;
  }

  get directionEnd(): LatLngLiteral {
    return this.last ? this.last.coordinates : null;
  }

  get sortedTripPlaces(): PlaceModel[] {
    const clearedPlaces = this.tripPlaces
      .filter(place => place.id !== this.first.id)
      .filter(place => place.id !== this.last.id);
    return [this.first, ...clearedPlaces, this.last];
  }

}
