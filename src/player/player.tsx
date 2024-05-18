import { Score } from "./score";

export function Player({ score }: { score: Score }) {
  return <pre>{JSON.stringify(score.events, null, 2)}</pre>;
}
