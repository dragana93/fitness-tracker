import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AngularFireModule } from "angularfire2";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { StoreModule } from "@ngrx/store";

import { WelcomeComponent } from "./welcome/welcome.component";
import { HeaderComponent } from "./navigation/header/header.component";
import { SidenavListComponent } from "./navigation/sidenav-list/sidenav-list.component";
import { AuthService } from "./auth/auth.service";
import { TrainingService } from "./training/training.service";
import { environment } from "../environments/environment";
import { UiService } from "./shared/ui.service";
import { AuthModule } from "./auth/auth.module";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { appReducer } from "./app.reducer";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AuthModule,
    FlexLayoutModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(
      environment.firebase,
      "ng-fitness-tracker-ga"
    ),
    StoreModule.forRoot({ ui: appReducer })
  ],
  providers: [AuthService, TrainingService, UiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
