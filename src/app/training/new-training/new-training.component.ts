import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, Subscription } from "rxjs";
import { UiService } from "src/app/shared/ui.service";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();

  exercises: Exercise[] = [];
  // exercises: Observable<Exercise[]>;
  private exercisesSubscription: Subscription;

  isLoading = true;
  private loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    // this.exercises = this.trainingService.getAvailableExercises();
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      exs => {
        this.exercises = exs;
      }
    );
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
  ngOnDestroy() {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}
