import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";
import { UiService } from "../shared/ui.service";

@Injectable({
  providedIn: "root"
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  finishedExercisesChanged = new Subject<Exercise[]>();

  fbSubscripion: Subscription[] = [];

  // private availableExercises: Exercise[] = [
  //   { id: "crunches", name: "Crunches", duration: 30, calories: 8 },
  //   { id: "touch-toes", name: "Touch Toes", duration: 50, calories: 15 },
  //   { id: "side-lunges", name: "Side Lunges", duration: 25, calories: 20 },
  //   { id: "burpees", name: "Burpees", duration: 40, calories: 12 }
  // ];

  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise;
  // private finishedExercises: Exercise[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService) {}

  fatchAvailableExercises() {
    // return this.availableExercises.slice();
    this.uiService.loadingStateChanged.next(true);
    this.fbSubscripion.push(
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
          this.uiService.loadingStateChanged.next(false);
          console.log(exercises);
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        })
    );
  }

  startExercise(selectedId: string) {
    //select single document and update
    // this.db
    //   .doc("availableExercises/" + selectedId)
    //   .update({ lastSelected: new Date() });
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
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

  fatchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    this.fbSubscripion.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          // this.finishedExercises = exercises;
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscripion.forEach(sub => sub.unsubscribe());
  }
}
