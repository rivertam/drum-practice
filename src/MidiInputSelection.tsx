import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

export function MidiInputSelection({
  onMidiSelected,
}: {
  onMidiSelected: (midi: MIDIInput | undefined) => void;
}) {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);

  const midiDevices = (midiAccess &&
    Array.from(midiAccess.inputs.values())) || [
    { id: "1", name: "Loading..." },
  ];

  const setOpenChange = async (open: boolean) => {
    if (open) {
      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
    }
  };

  const [selectedMidiDevice, setSelectedMidiDevice] = useState<
    MIDIInput | undefined
  >();

  useEffect(() => {
    onMidiSelected(selectedMidiDevice);
  }, [selectedMidiDevice, onMidiSelected]);

  let divClass = "absolute w-72 ";

  if (!selectedMidiDevice) {
    divClass += "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  } else {
    divClass += "top-10 left-10";
  }

  return (
    <div className={divClass}>
      <Select
        label="Select your MIDI device"
        className="max-w-xs"
        onOpenChange={setOpenChange}
        items={midiDevices as Array<{ id: string; name: string }>}
        onChange={(e) => {
          const device = midiDevices.find(
            (device): device is MIDIInput =>
              device instanceof MIDIInput && device.id === e.target.value,
          );

          setSelectedMidiDevice(device);
        }}
      >
        {(device) => (
          <SelectItem key={device.id} value={device.id}>
            {device.name}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
