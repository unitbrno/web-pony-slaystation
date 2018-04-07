import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import {AgmDirectionModule} from 'agm-direction';
import { PlacesService } from './places.service';
import {GoogleDirectionsService} from "./google-directions.service";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyBAq7Y7h9YFZuhgfAXsORx68R9hKRyeoaU'
    }),
    AgmDirectionModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    PlacesService,
    GoogleDirectionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
