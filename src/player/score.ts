import { Drum } from "../MidiMapping";

/**
 * The notes corresponding to an exercise or song.
 *
 * Includes methods to judge notes as the user hits them.
 */
export class Score {
  // a score is composed of a list of events
  private events = new Array<{
    // timestamp of the event
    timestamp: number;
    notes: Array<{
      drum: Drum;
      velocity: { min: number; max: number };
    }>;
  }>();

  private findMostRecentEventIndex(timestamp: number): number {
    let index = 0;

    while (
      index < this.events.length &&
      this.events[index].timestamp <= timestamp
    ) {
      index++;
    }

    return index - 1;
  }

  public addNote(
    timestamp: number,
    note: Drum,
    velocity: { min: number; max: number },
  ) {
    const index = this.findMostRecentEventIndex(timestamp);

    const lastEvent = this.events[index];

    if (lastEvent && lastEvent.timestamp === timestamp) {
      lastEvent.notes.push({ drum: note, velocity });
      return;
    }

    this.events.splice(index, 0, {
      timestamp,
      notes: [{ drum: note, velocity }],
    });
  }

  public getEvents(): Readonly<
    Array<{
      timestamp: number;
      notes: Array<{
        drum: Drum;
        velocity: { min: number; max: number };
      }>;
    }>
  > {
    return this.events;
  }
}
