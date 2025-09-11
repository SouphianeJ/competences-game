import type { Level } from "./types";

const LEVELS: Level[] = [
  {
    id: "AOCE-001",
    slots: {
      A: [
        { id: "a1", text: "Concevoir des dispositifs d'évaluation", isCorrect: true },
        { id: "a2", text: "Être motivé par l'évaluation", isCorrect: false },
        { id: "a3", text: "Rendre l'évaluation intéressante", isCorrect: false }
      ],
      O: [
        { id: "o1", text: "pour des projets notés", isCorrect: true },
        { id: "o2", text: "pour des cours engageants", isCorrect: false },
        { id: "o3", text: "pour des ateliers libres", isCorrect: false }
      ],
      C: [
        { id: "c1", text: "en Licence 1", isCorrect: true },
        { id: "c2", text: "dans tout cursus", isCorrect: false },
        { id: "c3", text: "en colloque de recherche", isCorrect: false }
      ],
      E: [
        { id: "e1", text: "avec grille critériée et seuils", isCorrect: true },
        { id: "e2", text: "selon intérêt perçu", isCorrect: false },
        { id: "e3", text: "au jugement de l’enseignant", isCorrect: false }
      ]
    },
    template: "{A} {O} {C} {E}."
  }
];

export function pickLevel(): Level {
  // POC : renvoyer toujours le premier
  return LEVELS[0];
}
