import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";

import { Subject } from "rxjs/Subject";

@Injectable({
  providedIn: "root"
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private availableExercises: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
    { id: "touch-toes", name: "Touch Toes", duration: 180, calories: 50 },
    { id: "side-lunges", name: "Side Lunges", duration: 120, calories: 25 },
    { id: "burpees", name: "Burpees", duration: 60, calories: 12 }
  ];

  private runningExercise: Exercise;

  constructor() {}

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }
}
