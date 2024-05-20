import { useEffect, useState } from "react";
import { Score, TimeSignature } from "../score";

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

export function TimeGrid({
  milliseconds,
  bpm,
  signature,
}: {
  milliseconds: number;
  bpm: number;
  signature: TimeSignature;
}) {
  const [distanceBetweenTicks, setDistanceBetweenTicks] = useState(0);

  const divRef = (div: HTMLDivElement | null): void => {
    if (!div) {
      return;
    }

    const height = div.clientHeight;

    setDistanceBetweenTicks(height / (signature.top * 2));
  };

  // fractional beats since start
  const beatsSinceStart = (bpm / 60 / 1000) * milliseconds + 1;
  // the next beat integer
  const nextBeat = Math.ceil(beatsSinceStart);

  const pixelOffset = Math.round(
    (nextBeat - beatsSinceStart) * distanceBetweenTicks,
  );

  return (
    <div ref={divRef} className="w-full h-full">
      <div
        className="w-full h-full"
        style={{ transform: `translateY(-${pixelOffset}px)` }}
      >
        {new Array(signature.top * 3).fill(null).map((_, index) => {
          return (
            <div
              key={index}
              style={{
                transform: `translateY(${distanceBetweenTicks * (signature.top - index)}px)`,
              }}
              className="absolute w-full h-0.5 bg-gray-500 top-3/4"
            />
          );
        })}
      </div>
    </div>
  );
}
