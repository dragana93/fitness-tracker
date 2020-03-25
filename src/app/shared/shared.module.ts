import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [FormsModule, MaterialModule, FlexLayoutModule],
  exports: [FormsModule, MaterialModule, FlexLayoutModule]
})
export class SharedModule {}
