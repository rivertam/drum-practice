import React, { useEffect } from "react";
import { MidiMap, invertMidiMap } from "./MidiMapping";
import { Drum } from "./Drum";

export type Message = {
  command: number;
  channel: number;
  note: number;
  drum?: Drum;
  velocity: number;
  timeStamp: number;
};

/**
 * Utilities for accessing the MIDIInput and MIDI mapping
 */
export class MidiInput {
  private static context = React.createContext<{
    input: MIDIInput | undefined;
    mapping: MidiMap;
  }>({} as never);

  /**
   * Shortcut for React Context Provider
   */
  public static Provider({
    value,
    children,
  }: {
    value: { input: MIDIInput; mapping: MidiMap };
    children: React.ReactNode;
  }) {
    useEffect(() => {
      const invertedMidiMap = invertMidiMap(value.mapping);

      if (!value.input) return;

      const onMessage = (event: MIDIMessageEvent) => {
        const [num, note, velocity] = event.data!;
        const command = num >> 4;
        const channel = num & 0xf;
        MidiInput.messageListeners.forEach((fn) => {
          fn({
            command,
            channel,
            note,
            drum: invertedMidiMap[note] ?? undefined,
            velocity,
            timeStamp: event.timeStamp,
          });
        });
      };

      value.input.onmidimessage = onMessage;
      return () => {
        if (value.input.onmidimessage === onMessage) {
          value.input.onmidimessage = null;
        }
      };
    }, [value]);

    return (
      <MidiInput.context.Provider value={value}>
        {children}
      </MidiInput.context.Provider>
    );
  }

  public static messageListeners = new Set<(message: Message) => void>();

  public static useOnMessage(fn: (message: Message) => void, deps: any[] = []) {
    useEffect(() => {
      this.messageListeners.add(fn);

      return () => {
        this.messageListeners.delete(fn);
      };
    }, deps);
  }
}
