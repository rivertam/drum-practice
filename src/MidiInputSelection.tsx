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

  // use localstorage to automatically set the MIDI input on mount
  useEffect(() => {
    const storedInput = localStorage.getItem("midiInput");

    // if user previously set a midi input but has yet to open the select,
    // automatically request MIDI devices
    if (storedInput && !midiAccess) {
      setOpenChange(true);
      return;
    }

    const foundDevice = midiDevices.find((input) => input.id === storedInput);

    if (foundDevice) {
      setSelectedMidiDevice(foundDevice as MIDIInput);
    }
  }, [midiAccess, midiDevices]);

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
        className="max-w-xs h-20"
        onOpenChange={setOpenChange}
        items={midiDevices as Array<{ id: string; name: string }>}
        selectedKeys={[selectedMidiDevice?.id].filter((a): a is string =>
          Boolean(a),
        )}
        onChange={(e) => {
          const device = midiDevices.find(
            (device): device is MIDIInput =>
              device instanceof MIDIInput && device.id === e.target.value,
          );

          setSelectedMidiDevice(device);

          if (device) {
            localStorage.setItem("midiInput", device.id);
          } else {
            localStorage.removeItem("midiInput");
          }
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
