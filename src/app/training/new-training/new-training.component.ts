import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();

  // exercises: Exercise[] = [];
  exercises: Observable<any>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();
    this.exercises = this.db.collection("availableExercises").valueChanges();
    // .subscribe(result => {
    //   console.log(result);
    // });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    // this.trainingStart.emit();
  }
}
