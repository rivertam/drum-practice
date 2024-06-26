import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

import { ExerciseParameters } from "./ExerciseParameters";

export function ExerciseSelection({
  onExerciseSelected,
}: {
  onExerciseSelected: (
    exercise: ExerciseParameters["kind"] | undefined,
  ) => void;
}) {
  const [selectedExercise, setSelectedExercise] = useState<
    ExerciseParameters["kind"]
  >(() => {
    return (
      (localStorage.getItem(
        "selectedExercise",
      ) as ExerciseParameters["kind"]) ?? undefined
    );
  });

  useEffect(() => {
    onExerciseSelected(selectedExercise);

    if (selectedExercise) {
      localStorage.setItem("selectedExercise", selectedExercise);
    } else {
      localStorage.removeItem("selectedExercise");
    }
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
        selectedKeys={[selectedExercise]}
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
