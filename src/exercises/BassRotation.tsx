import { useState } from "react";
import { Drums } from "../MidiMapping";
import { Beat, Score, TimeSignature } from "../score";
import { Player } from "../player";

const ANY_VELOCITY = { min: 0, max: 127 };

export class BassRotationScore implements Score {
  private timeSignature: TimeSignature = {
    top: 4,
    bottom: 4,
  };

  public currentBassSpot = {
    beat: 1,
    offset: 0,
  };

  public getTimeSignature(): Readonly<TimeSignature> {
    return this.timeSignature;
  }

  private typicalBeat(beatNumber: number): Beat {
    return {
      beatNumber,
      notes: [
        {
          offset: 0,
          drum: Drums.ride,
          velocity: ANY_VELOCITY,
        },
        {
          offset: 0.5,
          drum: Drums.ride,
          velocity: ANY_VELOCITY,
        },
      ],
    };
  }

  public *getBeats(): Generator<Beat> {
    let beatNumber = 1;
    while (true) {
      const beat1 = this.typicalBeat(beatNumber++);
      yield beat1;

      const beat2 = this.typicalBeat(beatNumber++);
      beat2.notes.push({
        offset: 0,
        drum: Drums.snare,
        velocity: ANY_VELOCITY,
      });
      yield beat2;

      const beat3 = this.typicalBeat(beatNumber++);
      yield beat3;

      const beat4 = this.typicalBeat(beatNumber++);
      beat4.notes.push({
        offset: 0,
        drum: Drums.snare,
        velocity: ANY_VELOCITY,
      });
      yield beat4;
    }
  }
}

export type BassRotationExercise = {
  kind: "bass rotation";
  timeSignature: TimeSignature;
};

export function BassRotationPlayer() {
  const [score] = useState(() => new BassRotationScore());

  return (
    <>
      <Player score={score} />
    </>
  );
}
