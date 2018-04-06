import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { NouisliderModule } from 'ng2-nouislider';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    NouisliderModule,
    MatSidenavModule,
    MatCardModule,
  ],
  declarations: [],
  exports:[
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    NouisliderModule,
    MatSidenavModule,
    MatCardModule,
  ]
})
export class MaterialModule { }
