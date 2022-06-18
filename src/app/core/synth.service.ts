import { Injectable } from '@angular/core';
import * as Tone from 'tone'
import { Synth } from "tone";

export interface Sound {
  key: string;
  level: number;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class SynthService {

  private _currentSynth: Synth | undefined;
  private _currentSound: Sound = {key: '', level: 0, duration: 0};
  private _currentLoop: any;

  constructor() {

  }

  playSound({key, level, duration}: Sound, callback?: () => void): void {
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.Synth({
      context: {
        currentTime: 0
      },
      onsilence: () => callback?.call(this)
    }).toDestination();

    this._currentSynth = synth;
    this._currentSound = {key,level, duration};

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease(key + level, duration+ "n");
  }

  loopSound(): void {
    const {key, level, duration} = this._currentSound;

    if (key && level && duration) {
      const loopA = new Tone.Loop(time => {
        this._currentSynth?.triggerAttackRelease(key + level, duration + "n", time);
      }, "4n").start(0);

      Tone.Transport.start()
      this._currentLoop = loopA;
    }
  }

  stopLoop(): void {
    this._currentLoop && this._currentLoop.stop();
  }
}
