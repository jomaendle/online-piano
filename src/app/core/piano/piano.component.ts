import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { asyncScheduler, filter, fromEvent, map, Observable, throttleTime } from "rxjs";
import { SynthService } from "../synth.service";

export interface PianoKey {
  tune: string;
  isWhite: boolean;
  key: string;
}


const WHITE_KEYS: string[] = ['y', 'x', 'c', 'v', 'b', 'n', 'm'];
const BLACK_KEYS: string[] = ['s', 'd', 'g', 'h', 'j'];

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.scss'],
})
export class PianoComponent implements OnInit, AfterViewInit {
  @ViewChildren('audio') audios:
    | QueryList<ElementRef<HTMLAudioElement>>
    | undefined;

  keys: PianoKey[] = [
    { tune: 'C', isWhite: true, key: 'y'},
    { tune: 'Db', isWhite: false, key: 's' },
    { tune: 'D', isWhite: true, key: 'x' },
    { tune: 'E', isWhite: false, key: 'd' },
    { tune: 'Eb', isWhite: true, key: 'c' },
    { tune: 'F', isWhite: true, key: 'v' },
    { tune: 'Gb', isWhite: false, key: 'g' },
    { tune: 'G', isWhite: true, key: 'b' },
    { tune: 'Ab', isWhite: false, key: 'h' },
    { tune: 'A', isWhite: true, key: 'n' },
    { tune: 'Bb', isWhite: false, key: 'j' },
    { tune: 'B', isWhite: true, key: 'm' },
  ];

  _blackKeys: HTMLAudioElement[] | undefined = [];
  _whiteKeys: HTMLAudioElement[] | undefined = [];

  constructor(private _synthService: SynthService) {

    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((event: KeyboardEvent) => !event.repeat),
      map((event: KeyboardEvent) => event.key)
    ).subscribe((key: string) => {
      const whiteKeyIndex: number = WHITE_KEYS.indexOf(key);
      const blackKeyIndex: number = BLACK_KEYS.indexOf(key);

      if (whiteKeyIndex !== -1) {
        // @ts-ignore
        const key: PianoKey | undefined = this.keys.find(i => i.tune === this._whiteKeys[whiteKeyIndex].id.split('-')[0]);
        if (key) {
          const index = this.keys.indexOf(key);
          this.playSound(this.keys[index]);
        }
      }

      if (blackKeyIndex !== -1) {
        // @ts-ignore
        const key: PianoKey | undefined = this.keys.find(i => i.tune === this._blackKeys[blackKeyIndex].id.split('-')[0]);
        if (key) {
          const index = this.keys.indexOf(key);
          this.playSound(this.keys[index]);
        }
      }

    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const mappedAudios: HTMLAudioElement[] | undefined = this.audios?.toArray().map((audio: ElementRef<HTMLAudioElement>) => audio.nativeElement);

    this._blackKeys = (mappedAudios ?? []).filter((audio: HTMLAudioElement) => audio.id.includes('black'))
    this._whiteKeys = (mappedAudios ?? []).filter((audio: HTMLAudioElement) => audio.id.includes('white'))
  }

  playSound(key: PianoKey): void {
    this._synthService.playSound(key.tune)
  }

}
