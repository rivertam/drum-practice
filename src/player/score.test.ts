import { Drums } from "../MidiMapping";
import { Score } from "./score";

describe("Score", () => {
  describe("addNote", () => {
    it("adds only one event when two notes are added at the same time", () => {
      const score = new Score();

      score.addNote(125, Drums.bass, { min: 0, max: 127 });
      score.addNote(125, Drums.snare, { min: 0, max: 127 });

      const events = score.getEvents();
      expect(events).toEqual([
        {
          timestamp: 125,
          notes: [
            { drum: Drums.bass, velocity: { min: 0, max: 127 } },
            { drum: Drums.snare, velocity: { min: 0, max: 127 } },
          ],
        },
      ]);
    });
  });
});
