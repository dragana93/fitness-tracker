import { Component, OnInit } from "@angular/core";

import { TrainingService } from "./training.service";
// import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromTraining from "./training.reducer";
import { Observable } from "rxjs";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.css"],
})
export class TrainingComponent implements OnInit {
  // ongoingTraining = false;
  // exerciseSubsription: Subscription;

  ongoingTraining$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
    // this.exerciseSubsription = this.trainingService.exerciseChanged.subscribe(
    //   exercise => {
    //     if (exercise) {
    //       this.ongoingTraining = true;
    //     } else {
    //       this.ongoingTraining = false;
    //     }
    //   }
    // );
  }

  // ngOnDestroy() {
  //   if (this.exerciseSubsription) {
  //     this.exerciseSubsription.unsubscribe();
  //   }
  // }
}
