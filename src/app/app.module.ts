import {Location } from './common/Location';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MineSweepersComponent } from './mine-sweepers/mine-sweepers.component';

@NgModule({
  declarations: [
    AppComponent,
    MineSweepersComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
