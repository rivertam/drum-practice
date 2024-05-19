import * as React from "react";
import { useState } from "react";
import { Button, NextUIProvider } from "@nextui-org/react";
import "./App.css";
import { MidiInputSelection } from "./MidiInputSelection";
import { ExerciseSelection } from "./ExerciseSelection";
import { ExerciseParameters } from "./ExerciseParameters";
import { MidiMap, MidiMapping, isMidiMapComplete } from "./MidiMapping";
import { BassRotationPlayer } from "./exercises/BassRotation";

function App() {
  const [midiInput, setMidiInput] = useState<MIDIInput>();
  const [midiMapping, setMidiMapping] = useState<MidiMap>({} as MidiMap);
  const [exercise, setExercise] = useState<ExerciseParameters["kind"]>();

  // override view state
  // TODO: routing solution
  const [view, setView] = useState<null | "midi">(null);

  const shouldShowMidiMapping =
    !isMidiMapComplete(midiMapping) || view === "midi";

  return (
    <React.StrictMode>
      <NextUIProvider>
        <div className="flex items-center justify-center h-screen w-full">
          <MidiInputSelection
            onMidiSelected={(input) => {
              setMidiInput(input);
            }}
          />

          {midiInput && shouldShowMidiMapping && (
            <MidiMapping
              midiInput={midiInput}
              onChange={(map) => {
                setMidiMapping(map);
              }}
              onDone={() => {
                setView((view) => (view === "midi" ? null : view));
              }}
            />
          )}

          {midiInput && !shouldShowMidiMapping && (
            <Button
              onClick={() => setView("midi")}
              className="absolute w-20 top-12 left-80 ml-5 bg-default-100"
            >
              Remap
            </Button>
          )}

          {!shouldShowMidiMapping && midiInput && (
            <ExerciseSelection onExerciseSelected={setExercise} />
          )}

          {(() => {
            switch (exercise) {
              case "bass rotation": {
                return <BassRotationPlayer />;
              }
            }
          })()}
        </div>
      </NextUIProvider>
    </React.StrictMode>
  );
}

export default App;
