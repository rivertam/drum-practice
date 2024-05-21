import { useEffect, useRef, useState } from "react";
import { Beat, Score } from "../score";
import { TimeGrid } from "./TimeGrid";
import { Drums } from "../MidiMapping";
import { BeatView } from "./Beat";

export function Player({ score }: { score: Score }) {
  const [generator] = useState(() => score.getBeats());
  const [bpm, setBpm] = useState(120);
  const [milliseconds, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    let lastTime = Date.now();
    let stillGoing = true;

    const updateTime = () => {
      if (!stillGoing) {
        return;
      }
      const now = Date.now();
      setCurrentTime((time) => time + now - lastTime);
      lastTime = now;

      requestAnimationFrame(updateTime);
    };

    requestAnimationFrame(updateTime);

    return () => {
      stillGoing = false;
    };
  }, [playing]);

  const timeSignature = score.getTimeSignature();

  const [beatsToDisplay, setBeatsToDisplay] = useState<Array<Beat>>([]);

  const divRef = useRef<HTMLDivElement>(null);
  const divHeight = divRef.current?.clientHeight ?? 0;

  const distanceBetweenTicks = divHeight / (timeSignature.top * 2);

  // fractional beats since start
  const beatsSinceStart = (bpm / 60 / 1000) * milliseconds + 1;
  // the next beat integer
  const nextBeat = Math.ceil(beatsSinceStart);

  const pixelOffset = Math.round(
    (nextBeat - beatsSinceStart) * distanceBetweenTicks,
  );

  useEffect(() => {
    const newBeats = new Array<Beat>();
    do {
      newBeats.push(generator.next().value);
    } while (
      newBeats[newBeats.length - 1].beatNumber <
      nextBeat + timeSignature.top * 3
    );

    setBeatsToDisplay((beats) =>
      // add new beats
      [...beats, ...newBeats]
        // remove beats that are too far in the past
        .filter(({ beatNumber }) => beatNumber >= nextBeat - timeSignature.top),
    );
  }, [nextBeat, timeSignature]);

  return (
    <div className="w-1/2 max-w-screen-sm bg-green-300 h-full max-h-fit m-0 overflow-hidden relative">
      {/* Overall canvas */}
      <div ref={divRef} className="w-full h-full">
        {/* Moving "canvas" based around current time line*/}
        <div
          className="w-full h-full"
          style={{ transform: `translateY(-${pixelOffset}px)` }}
        >
          <TimeGrid
            className="absolute top-3/4"
            distanceBetweenTicks={distanceBetweenTicks}
            nextBeat={nextBeat}
            signature={timeSignature}
          />

          {beatsToDisplay.map((beat) => {
            return (
              <BeatView
                key={beat.beatNumber}
                beat={beat}
                distanceBetweenTicks={distanceBetweenTicks}
                nextBeat={nextBeat}
              />
            );
          })}
        </div>
        {/* Current time line */}
        <div className="absolute w-full h-0.5 bg-blue-500 top-3/4"></div>

        <div className="absolute top-0" onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </div>
      </div>
    </div>
  );
}
