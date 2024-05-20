import { useEffect, useState } from "react";
import { Score } from "../score";
import { TimeGrid } from "./TimeGrid";

export function Player({ score }: { score: Score }) {
  const [generator] = useState(() => score.getBeats());
  const [bpm, setBpm] = useState(120);
  const [milliseconds, setCurrentTime] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-1/2 max-w-screen-sm bg-green-300 h-full max-h-fit -translate-y-8 m-6">
      {/* Current time line */}
      <div className="absolute w-full h-0.5 bg-blue-500 top-3/4"></div>

      <TimeGrid
        milliseconds={milliseconds}
        bpm={bpm}
        signature={score.getTimeSignature()}
      />
    </div>
  );
}
