import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export const Drums = { bass: "bass", snare: "snare", ride: "ride" } as const;

export type Drum = (typeof Drums)[keyof typeof Drums];

export type MidiMap = Record<Drum, number>;

export type InvertedMidiMap = Record<number, Drum>;

export function invertMidiMap(map: MidiMap): InvertedMidiMap {
  return Object.fromEntries(
    Object.entries(map).map(([drum, note]) => [note, drum as Drum]),
  );
}

export function isMidiMapComplete(map: MidiMap) {
  return "bass" in map && "snare" in map && "ride" in map;
}

const noteTesterColumns = [
  { key: "time", label: "Time" },
  { key: "note", label: "Note" },
  { key: "velocity", label: "Velocity" },
  { key: "drum", label: "Drum" },
];

const NOTE_MEANINGS = {
  NOTE_ON: 0x9,
  NOTE_OFF: 0x8,
};

export function MidiMapping({
  midiInput,
  onChange,
  onDone,
}: {
  midiInput: MIDIInput;
  onChange: (map: MidiMap) => void;
  onDone: () => void;
}) {
  const [midiMap, setMidiMap] = useState<MidiMap>(() => {
    return JSON.parse(localStorage.getItem("midiMap") ?? "{}");
  });

  const invertedMidiMap = invertMidiMap(midiMap);

  const [remappingDrum, setRemappingDrum] = useState<Drum | undefined>();

  const isValid = isMidiMapComplete(midiMap);

  useEffect(() => {
    localStorage.setItem("midiMap", JSON.stringify(midiMap));
  }, [isValid, midiMap]);

  const [midiNotes, setMidiNotes] = useState<
    Array<{
      note: number;
      velocity: number;
      start: number;
      stop: number | null;
      channel: number;
    }>
  >([]);

  useEffect(() => {
    if (isValid) {
      onChange(midiMap);
    }
  }, [midiMap, isValid]);

  useEffect(() => {
    midiInput.onmidimessage = (event) => {
      const [num, note, velocity] = event.data!;

      const command = num >> 4;
      const channel = num & 0xf;

      if (command === NOTE_MEANINGS.NOTE_ON) {
        setMidiNotes((notes) => {
          const newNote = {
            note,
            velocity,
            start: event.timeStamp,
            stop: null,
            channel,
          };

          return [newNote, ...notes];
        });

        if (remappingDrum) {
          setMidiMap((map) => {
            return { ...map, [remappingDrum]: note };
          });

          setRemappingDrum(undefined);
        }
      } else if (command === NOTE_MEANINGS.NOTE_OFF) {
        setMidiNotes((notes) => {
          const last = notes.findLast((n) => n.note === note);

          if (last) {
            last.stop = event.timeStamp;
          }

          return [...notes];
        });
      }
    };

    return () => {
      midiInput.onmidimessage = null;
    };
  }, [midiInput, remappingDrum]);

  return (
    <div className="w-full flex flex-row content-center justify-center">
      <div className="w-2/5 flex flex-col max-w-96 justify-center h-96">
        <div className="w-full my-3 flex flex-row justify-end gap-0.5 h-10">
          <Button
            isDisabled={!isValid}
            color="primary"
            className="w-20 inline-block h-10"
            onClick={() => {
              setMidiMap(midiMap);

              onDone();
            }}
          >
            Done
          </Button>
        </div>

        <Table
          color="primary"
          selectedKeys={[remappingDrum].filter((a): a is Drum => Boolean(a))}
          selectionMode="single"
          onSelectionChange={(selections) => {
            const selection = Array.from(selections)[0] as Drum | undefined;
            setRemappingDrum(selection);
          }}
          aria-label="MIDI drum mapping"
        >
          <TableHeader>
            <TableColumn className="w-10 text-center">DRUM</TableColumn>
            <TableColumn className="w-20 text-center">MIDI #</TableColumn>
          </TableHeader>
          <TableBody>
            {Object.entries(Drums).map(([key, drum]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {(() => {
                    if (remappingDrum === drum) {
                      return `Hit to map`;
                    }

                    return midiMap[drum] ?? "-";
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-2/5 max-w-96 ml-10 h-96">
        <h2 className="text-xl h-10 my-3">Test Drums</h2>

        <Table className="h-96" color="primary" aria-label="Note tester">
          <TableHeader columns={noteTesterColumns}>
            {(column) => (
              <TableColumn key={column.key} className="w-20 text-center">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={midiNotes}>
            {(note) => (
              <TableRow key={note.start.toString()}>
                <TableCell>{note.start.toString()}</TableCell>
                <TableCell>{note.note}</TableCell>
                <TableCell>{note.velocity}</TableCell>
                <TableCell>
                  {invertedMidiMap[note.note] ?? `Unassigned (${note.note})`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
