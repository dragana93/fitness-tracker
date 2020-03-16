import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  // private availableExercises: Exercise[] = [
  //   { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
  //   { id: "touch-toes", name: "Touch Toes", duration: 50, calories: 15 },
  //   { id: "side-lunges", name: "Side Lunges", duration: 25, calories: 20 },
  //   { id: "burpees", name: "Burpees", duration: 40, calories: 12 }
  // ];

  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  constructor(private db: AngularFirestore) {}

  fatchAvailableExercises() {
    // return this.availableExercises.slice();

    this.db
      .collection("availableExercises")
      .snapshotChanges()
      .pipe(
        map((docArray: any) => {
          // console.log(docArray);
          return docArray.map(doc => {
            // console.log(doc.payload.doc.data().name);
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }
  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
