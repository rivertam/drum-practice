import { useState } from "react";
import { Score } from "../score";

export function Player({ score }: { score: Score }) {
  const [generator] = useState(() => score.getBeats());

  return (
    <div className="w-1/2 max-w-screen-sm bg-green-300 h-full max-h-fit -translate-y-8 m-6">
      {/* Current time line */}
      <div className="absolute w-full h-0.5 bg-blue-500 top-3/4"></div>
    </div>
  );
}
