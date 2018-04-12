import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiPlaceModel, PlaceModel } from './place.model';
import {ClusterModel, ClusterRequestModel, ClustersResponseModel} from './cluster.model';
import {map} from "rxjs/operators";

const URL = 'http://localhost:5000';

@Injectable()
export class PlacesService {


  private places: ReplaySubject<PlaceModel[]> = new ReplaySubject<PlaceModel[]>(1);
  places$: Observable<PlaceModel[]> = this.places.asObservable();

  private clusters: ReplaySubject<ClusterModel[]> = new ReplaySubject<ClusterModel[]>(1);
  clusters$: Observable<ClusterModel[]> = this.clusters.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<ApiPlaceModel>(`${URL}/api/record?results_per_page=100`).subscribe(
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

  public getClusters(places: PlaceModel[]): Observable<ClusterModel[]> {
    return this.http.post<ClustersResponseModel>(`${URL}/clusterize`, { objects: places })
                  .pipe(map(item => item.clusters));
  }
}
