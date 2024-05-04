import * as React from "react";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import "./App.css";
import { MidiInputSelection } from "./MidiInputSelection";
import { ExerciseSelection } from "./ExerciseSelection";
import { ExerciseParameters } from "./ExerciseParameters";

function App() {
  const [midiInput, setMidiInput] = useState<MIDIInput>();
  const [exercise, setExercise] = useState<ExerciseParameters["kind"]>();

  return (
    <React.StrictMode>
      <NextUIProvider>
        <div className="flex items-center justify-center h-screen w-full">
          <MidiInputSelection onMidiSelected={setMidiInput} />
          {midiInput && <ExerciseSelection onExerciseSelected={setExercise} />}
        </div>
      </NextUIProvider>
    </React.StrictMode>
  );
}

export default App;
