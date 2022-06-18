import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PianoComponent } from "./piano.component";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        PianoComponent,
    ],
    exports: [
        PianoComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class PianoModule { }
