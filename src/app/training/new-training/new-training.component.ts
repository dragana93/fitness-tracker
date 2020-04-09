import { Component, OnInit } from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, Subscription } from "rxjs";
import { UiService } from "src/app/shared/ui.service";
import { Store } from "@ngrx/store";
import * as formTraining from "../training.reducer";
import * as formRoot from "../../app.reducer";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();

  // exercises: Exercise[] = [];
  exercises$: Observable<Exercise[]>;
  // private exercisesSubscription: Subscription;

  // isLoading = true;
  // private loadingSubs: Subscription;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<formTraining.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(formRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
    // this.exercises = this.trainingService.getAvailableExercises();

    // this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
    //   (exs) => {
    //     this.exercises = exs;
    //   }
    // );

    this.exercises$ = this.store.select(formTraining.getAvailableExercises);
    this.fetchExercises();
    // .subscribe(result => {
    //   console.log(result);

    //   //   for (const res of result) {
    //   //     console.log(res.payload.doc.data());
    //   //   }
    //   // });
    // });
  }

  fetchExercises() {
    this.trainingService.fatchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    // this.trainingStart.emit();
  }
  // ngOnDestroy() {
  //   if (this.exercisesSubscription) {
  //     this.exercisesSubscription.unsubscribe();
  //   }
  //   if (this.loadingSubs) {
  //     this.loadingSubs.unsubscribe();
  //   }
  // }
}
