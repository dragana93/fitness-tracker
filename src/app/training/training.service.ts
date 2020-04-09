import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { map, take } from "rxjs/operators";
import { Subscription } from "rxjs";
import { UiService } from "../shared/ui.service";
import * as UI from "../shared/ui.actions";
import { Store } from "@ngrx/store";
import * as formTraining from "./training.reducer";
import * as Training from "./training.action";

@Injectable({
  providedIn: "root",
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

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<formTraining.State>
  ) {}

  fatchAvailableExercises() {
    // return this.availableExercises.slice();
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoadingAction());
    this.fbSubscripion.push(
      this.db
        .collection("availableExercises")
        .snapshotChanges()
        .pipe(
          map((docArray: any) => {
            // throw new Error();
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data().name,
                duration: doc.payload.doc.data().duration,
                calories: doc.payload.doc.data().calories,
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoadingAction());
            // console.log(exercises);
            // this.availableExercises = exercises;
            // this.exercisesChanged.next([...this.availableExercises]);
            this.store.dispatch(
              new Training.SetAvailableTrainingsAction(exercises)
            );
          },
          (error) => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoadingAction());
            this.uiService.showSnackbar(
              "Fetching exercises failed, please try again later",
              null,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    //select single document and update
    // this.db
    //   .doc("availableExercises/" + selectedId)
    //   .update({ lastSelected: new Date() });

    // this.runningExercise = this.availableExercises.find(
    //   (ex) => ex.id === selectedId
    // );
    // this.exerciseChanged.next({ ...this.runningExercise });

    this.store.dispatch(new Training.StartTrainingAction(selectedId));
  }

  completeExercise() {
    this.store
      .select(formTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: "completed",
        });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTrainingAction());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(formTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: "cancelled",
        });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
        this.store.dispatch(new Training.StopTrainingAction());
      });
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fatchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    this.fbSubscripion.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          // this.finishedExercises = exercises;
          // this.finishedExercisesChanged.next(exercises);
          this.store.dispatch(
            new Training.SetFinishedTrainingsAction(exercises)
          );
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscripion.forEach((sub) => sub.unsubscribe());
  }
}
