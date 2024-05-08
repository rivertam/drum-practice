import { useEffect, useState } from "react";
import { ExerciseParameters } from "./ExerciseParameters";
import { Select, SelectItem } from "@nextui-org/react";

export function ExerciseSelection({
  onExerciseSelected,
}: {
  onExerciseSelected: (
    exercise: ExerciseParameters["kind"] | undefined,
  ) => void;
}) {
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseParameters["kind"]>();

  useEffect(() => {
    onExerciseSelected(selectedExercise);
  }, [selectedExercise]);

  let divClass = "absolute w-72 ";

  if (!selectedExercise) {
    divClass += "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  } else {
    divClass += "top-28 left-10";
  }

  return (
    <div className={divClass}>
      <Select
        label="Which exercise do you want to practice?"
        className="max-w-xs"
        color="default"
        items={[{ value: "bass rotation", label: "Bass Rotation" }]}
        onChange={(e) => {
          setSelectedExercise(e.target.value as ExerciseParameters["kind"]);
        }}
      >
        {(exercise) => (
          <SelectItem key={exercise.value} value={exercise.value}>
            {exercise.label}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
