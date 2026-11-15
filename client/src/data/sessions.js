/**
 * Lab content — assembled from the three data files below.
 * Each item: id, title, question, sampleInput, code, logic, concept, workflow, lang.
 * `lang` is "c" or "cpp" and decides which compiler the server runs.
 *
 * To add or remove a program, edit the matching file:
 *   labs-1-2.js  → Lab 1 & 2          (C)
 *   labs-3-4.js  → Lab 3 & 4          (C++)
 *   labs-5-8.js  → Lab 5, 6, 7 & 8    (C++)
 *   labs-9.js    → Lab 9              (C++)
 */
import { labs12 } from "./labs-1-2.js";
import { labs34 } from "./labs-3-4.js";
import { labs58 } from "./labs-5-8.js";
import { labs9 } from "./labs-9.js";

// Assembled in ascending lab order (1 → 9), then reversed so the
// chips read 9, 8, 7, 6, 5, 4, 3, 2, 1 — newest lab first.
const allLabs = [...labs12, ...labs34, ...labs58, ...labs9];

export const sessions = [...allLabs].reverse();
