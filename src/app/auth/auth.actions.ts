import { Action } from "@ngrx/store";

export const SET_AUTENTICATED = "[Auth] Set Authenticated";

export const SET_UNAUTENTICATED = "[Auth] Set Unauthenticated";

export class SetAuthenticatedAction implements Action {
  readonly type = SET_AUTENTICATED;
}

export class SetUnauthenticatedAction implements Action {
  readonly type = SET_UNAUTENTICATED;
}

export type AuthActions = SetAuthenticatedAction | SetUnauthenticatedAction;
