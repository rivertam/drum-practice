import { useState } from "react";
import { Drums } from "../MidiMapping";
import { Beat, Score, TimeSignature } from "../score";
import { Player } from "../player";

const ANY_VELOCITY = { min: 0, max: 127 };

export class BassRotationScore implements Score {
  public currentBassSpot = {
    beat: 1,
    offset: 0,
  };

  public getTimeSignature(): TimeSignature {
    return {
      top: 4,
      bottom: 4,
    };
  }

  private typicalBeat(): Beat {
    return {
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
    while (true) {
      const beat1 = this.typicalBeat();
      yield beat1;

      const beat2 = this.typicalBeat();
      beat2.notes.push({
        offset: 0,
        drum: Drums.snare,
        velocity: ANY_VELOCITY,
      });
      yield beat2;

      const beat3 = this.typicalBeat();
      yield beat3;

      const beat4 = this.typicalBeat();
      beat4.notes.push({
        offset: 0,
        drum: Drums.snare,
        velocity: ANY_VELOCITY,
      });
      yield beat2;
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
