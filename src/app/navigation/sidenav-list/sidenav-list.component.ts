import { Component, OnInit, EventEmitter, Output } from "@angular/core";

import { AuthService } from "src/app/auth/auth.service";
import { Subscription, Observable } from "rxjs";

import { Store } from "@ngrx/store";
import * as formRoot from "../../app.reducer";

@Component({
  selector: "app-sidenav-list",
  templateUrl: "./sidenav-list.component.html",
  styleUrls: ["./sidenav-list.component.css"],
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();

  // isAuth = false;
  authSubscription: Subscription;

  isAuth$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<formRoot.State>
  ) {}

  ngOnInit(): void {
    // this.authSubscription = this.authService.authChange.subscribe(
    //   authStatus => {
    //     this.isAuth = authStatus;
    //   }
    // );
    this.isAuth$ = this.store.select(formRoot.getIsAuth);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  // ngOnDestroy(): void {
  //   this.authSubscription.unsubscribe();
  // }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
