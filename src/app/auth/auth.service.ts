import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { AngularFireAuth } from "angularfire2/auth";

import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { TrainingService } from "../training/training.service";
import { UiService } from "../shared/ui.service";
import { Store } from "@ngrx/store";

import * as formRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authChange = new Subject<boolean>();
  // private user: User;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<formRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      console.log(user);

      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(["/login"]);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({ type: "START_LOADING" });
    this.store.dispatch(new UI.StartLoadingAction());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: "STOP_LOADING" });
        this.store.dispatch(new UI.StopLoadingAction());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: "STOP_LOADING" });
        this.store.dispatch(new UI.StopLoadingAction());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({ type: "START_LOADING" });
    this.store.dispatch(new UI.StartLoadingAction());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: "STOP_LOADING" });
        this.store.dispatch(new UI.StopLoadingAction());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: "STOP_LOADING" });
        this.store.dispatch(new UI.StopLoadingAction());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
