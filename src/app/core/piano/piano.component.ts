import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

export interface PianoKey {
  tune: string;
  isWhite: boolean;
}

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.scss'],
})
export class PianoComponent implements OnInit {
  @ViewChildren('audio') audios:
    | QueryList<ElementRef<HTMLAudioElement>>
    | undefined;

  keys: PianoKey[] = [
    { tune: 'C', isWhite: true },
    { tune: 'Db', isWhite: false },
    { tune: 'D', isWhite: true },
    { tune: 'E', isWhite: false },
    { tune: 'Eb', isWhite: true },
    { tune: 'F', isWhite: true },
    { tune: 'Gb', isWhite: false },
    { tune: 'G', isWhite: true },
    { tune: 'Ab', isWhite: false },
    { tune: 'A', isWhite: true },
    { tune: 'Bb', isWhite: false },
    { tune: 'B', isWhite: true },
  ];

  constructor() {}

  ngOnInit(): void {}

  onKeyClick(index: number): void {
    const audio: HTMLAudioElement | undefined =
      this.audios?.get(index)?.nativeElement;

    if (audio) {
      audio.parentElement?.classList.add('active');
      audio.currentTime = 0;
      audio.play();

      audio.addEventListener('ended', () => {
        audio.parentElement?.classList.remove('active');
      });
    }
  }
}
