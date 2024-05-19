import { Drum } from "../MidiMapping";

export type TimeSignature = { top: 4; bottom: 4 };

export type Beat = {
  notes: Array<{
    // % of a beat offset (e.g. 0 = on the beat, 0.25 = the "e" of the beat)
    offset: number;
    drum: Drum;
    velocity: { min: number; max: number };
  }>;
};

export interface Score {
  getBeats(): Generator<Beat>;
}
