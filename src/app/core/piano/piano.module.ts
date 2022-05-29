import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PianoComponent } from './piano.component';



@NgModule({
    declarations: [
        PianoComponent
    ],
    exports: [
        PianoComponent
    ],
    imports: [
        CommonModule
    ]
})
export class PianoModule { }
