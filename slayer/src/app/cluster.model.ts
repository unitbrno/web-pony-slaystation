import {PlaceModel} from './place.model';
import {LatLngLiteral} from "@agm/core";

export interface ClustersResponseModel {
  clusters: ClusterModel[];
}

export interface ClusterModel {
  coords: { lat: number, lon: number };
  points: PointModel[];
}

export interface PointModel {
  latitude: number;
  longitude: number;
  name: string;
}

export interface ClusterRequestModel {
  objects: PlaceModel[];
}
