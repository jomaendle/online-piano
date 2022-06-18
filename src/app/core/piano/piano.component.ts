import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { asyncScheduler, filter, fromEvent, map, Observable, Subject, takeUntil, throttleTime } from "rxjs";
import { SynthService } from "../synth.service";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";

export interface PianoKey {
  tune: string;
  isWhite: boolean;
  key: string;
}

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.scss'],
})
export class PianoComponent implements OnInit, OnDestroy {
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

  settingsForm: FormGroup = new FormGroup(
    { levelForm: new FormControl(4, [Validators.required, Validators.min(1), Validators.max(7)]) }
  );

  get levelForm(): AbstractControl | null {
    return this.settingsForm.get('levelForm');
  }

  levelUpButtonClicked: boolean = false;
  levelDownButtonClicked: boolean = false;

  private _destroy$: Subject<void> = new Subject<void>();
  private _activeKeyMap: Map<string, boolean> = new Map<string, boolean>();
  private _level: number = 4;
  private _duration: number = 4;

  constructor(private _synthService: SynthService, private _cdr: ChangeDetectorRef) {

    this.levelForm?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((level: number) => this._level = level)

    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((event: KeyboardEvent) => !event.repeat),
      map((event: KeyboardEvent) => event.key)
    ).subscribe((keyEvent: string) => {
      const pianoKey: PianoKey | undefined = this.keys.find((key) => key.key === keyEvent)
      if (pianoKey) {
        this.playSound(pianoKey);
      }

      if (keyEvent === 'q') {
        this.levelUpButtonClicked = true;
        this.increaseLevel();
        setTimeout(() => this.levelUpButtonClicked = false, 300)
      } else if (keyEvent === 'w') {
        this.levelDownButtonClicked = true;
        this.decreaseLevel();
        setTimeout(() => this.levelDownButtonClicked = false, 300)
      }
    })
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
      this._destroy$.next();
      this._destroy$.complete();
  }

  playSound({ key, tune }: PianoKey): void {
    const callback = () => {
      this._activeKeyMap.set(key, false);
    };

    this._activeKeyMap.set(key, true)
    this._synthService.playSound({ key: tune, level: this._level, duration: this._duration }, callback)
  }

  isActiveKey({ key }: PianoKey) {
   return this._activeKeyMap.has(key) && this._activeKeyMap.get(key) === true;
  }

  increaseLevel(): void {
    if (this._level < 7) {
      this._level = this._level + 1;
      this.levelForm?.setValue(this._level);
    }
  }

  decreaseLevel(): void {
    if (this._level > 0) {
      this._level = this._level - 1
      this.levelForm?.setValue(this._level);
    }
  }

  loopSound(): void {
    this._synthService.loopSound();
  }

  stopLoop(): void {
    this._synthService.stopLoop();
  }

}
