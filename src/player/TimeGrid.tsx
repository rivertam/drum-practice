import { TimeSignature } from "../score";

export function TimeGrid({
  className,
  distanceBetweenTicks,
  signature,
  nextBeat,
}: {
  className?: string;
  nextBeat: number;
  distanceBetweenTicks: number;
  signature: TimeSignature;
}) {
  return (
    <>
      {new Array(signature.top * 3).fill(null).map((_, index) => {
        const beat = nextBeat + index - signature.top;
        return (
          <div
            key={beat}
            style={{
              transform: `translateY(${distanceBetweenTicks * (signature.top - index)}px)`,
            }}
            className={`w-full h-0.5 bg-gray-500 ${className}`}
          >
            {beat}
          </div>
        );
      })}
    </>
  );
}
