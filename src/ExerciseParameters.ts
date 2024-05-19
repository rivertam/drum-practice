import { TimeSignature } from "./score";

export type BassRotation = {
  kind: "bass rotation";
  timeSignature: TimeSignature;
};

export type ExerciseParameters = BassRotation;
