import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {PianoModule} from "./core/piano/piano.module";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        PianoModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
