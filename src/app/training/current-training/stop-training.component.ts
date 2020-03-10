import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-stop-training",
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions>
  `,
  styleUrls: ["./current-training.component.css"]
})
export class StopTrainingComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}
}
