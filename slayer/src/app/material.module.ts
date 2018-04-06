import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  declarations: [],
  exports:[
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
  ]
})
export class MaterialModule { }
