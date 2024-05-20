import { useState } from "react";
import { TimeSignature } from "../score";

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
