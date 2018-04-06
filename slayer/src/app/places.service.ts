import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiPlaceModel, PlaceModel } from './place.model';

const URL = 'http://35.198.94.71:5000/api/record';

@Injectable()
export class PlacesService {


  private places: ReplaySubject<PlaceModel[]> = new ReplaySubject<PlaceModel[]>(1);
  places$: Observable<PlaceModel[]> = this.places.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<ApiPlaceModel>(`${URL}?results_per_page=100`).subscribe(
      (data: ApiPlaceModel) => {
        this.places.next(
          data.objects.map(item => ({
            ...item,
            coordinates: {lat: item.latitude, lng: item.longitude},
            iconUrl: `assets/${item.category_list[0]}.png`
          })));
      }
    );
  }
}
