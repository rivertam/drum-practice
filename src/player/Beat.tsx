import React from "react";
import { Drums } from "../MidiMapping";
import { Beat } from "../score";

// One beat (with potentially multiple notes) in the Player view
export const BeatView = React.memo(
  ({
    beat,
    distanceBetweenTicks,
    nextBeat,
  }: {
    beat: Beat;
    distanceBetweenTicks: number;
    nextBeat: number;
  }) => {
    const notes = beat.notes.map((note) => {
      let className = "absolute w-1/3 h-0.5 top-3/4 ";
      if (note.drum === Drums.bass) {
        className += "bg-blue-500 left-0";
      } else if (note.drum === Drums.snare) {
        className += "bg-red-500 left-1/3";
      } else if (note.drum === Drums.ride) {
        className += "bg-yellow-500 left-2/3";
      }

      return (
        <div
          className={className}
          key={`${beat.beatNumber}-${note.offset}-${note.drum}`}
          style={{
            transform: `translateY(${
              distanceBetweenTicks * (nextBeat - beat.beatNumber - note.offset)
            }px)`,
          }}
        >
          {beat.beatNumber}
        </div>
      );
    });

    return <>{notes}</>;
  },
);
