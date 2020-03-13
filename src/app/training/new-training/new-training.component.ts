import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();

  // exercises: Exercise[] = [];
  exercises: Observable<Exercise[]>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();
    this.exercises = this.db
      .collection("availableExercises")
      .snapshotChanges()
      .pipe(
        map((docArray: any) => {
          // console.log(docArray);
          return docArray.map(doc => {
            console.log(doc.payload.doc.data().name);
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories
            };
          });
        })
      );

    // .subscribe(result => {
    //   console.log(result);

    //   //   for (const res of result) {
    //   //     console.log(res.payload.doc.data());
    //   //   }
    //   // });
    // });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    // this.trainingStart.emit();
  }
}
