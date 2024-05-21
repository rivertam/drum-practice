import { useEffect, useState } from "react";
import { Score } from "../score";
import { TimeGrid } from "./TimeGrid";

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

  return (
    <div className="w-1/2 max-w-screen-sm bg-green-300 h-full max-h-fit m-0 overflow-hidden relative">
      <TimeGrid
        milliseconds={milliseconds}
        bpm={bpm}
        signature={score.getTimeSignature()}
      />
      {/* Current time line */}
      <div className="absolute w-full h-0.5 bg-blue-500 top-3/4"></div>

      <div className="absolute top-0" onClick={() => setPlaying((p) => !p)}>
        {playing ? "Pause" : "Play"}
      </div>
    </div>
  );
}
