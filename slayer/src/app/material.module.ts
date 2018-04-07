import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatSelectModule, MatSidenavModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
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
    MatTooltipModule,
    MatSelectModule,
  ],
  declarations: [],
  exports:[
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    NouisliderModule,
    MatSidenavModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
