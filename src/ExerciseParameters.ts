type TimeSignature = { top: 4; bottom: 4 };

export type BassRotation = {
  kind: "bass rotation";
  timeSignature: TimeSignature;
};

export type ExerciseParameters = BassRotation;
