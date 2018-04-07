import { LatLngLiteral } from '@agm/core';

export interface PlaceModel {
  categories?: string;
  category_list?: string[];
  description?: string;
  id?: number;
  latitude?: number;
  link?: string;
  longitude?: number;
  name: string;
  photo_url?: string;
  price?: string;
  time_period?: string;
  coordinates: LatLngLiteral;
  iconUrl?: string;
}

export interface ApiPlaceModel {
  num_results: number;
  objects: PlaceModel[];
  page: number;
  total_pages: number;
}