import {Location } from './common/Location';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MineSweepersComponent } from './mine-sweepers/mine-sweepers.component';
import { LevelPipePipe } from './pipes/level-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MineSweepersComponent,
    LevelPipePipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
