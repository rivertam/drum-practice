import { MidiInput } from "../MidiInput";

export function PauseMenu({ onUnpause }: { onUnpause: () => void }) {
  MidiInput.useOnMessage((message) => {
    if (message.drum === "snare") {
      onUnpause();
    }
  }, []);

  return (
    <div
      onClick={onUnpause}
      className="absolute bg-white w-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      Click here or hit the snare to start
    </div>
  );
}
