import { Action } from "@ngrx/store";

export const START_LOADING = "[UI] Start Loading";

export const STOP_LOADING = "[UI] Stop Loading";

export class StartLoadingAction implements Action {
  readonly type = START_LOADING;
}

export class StopLoadingAction implements Action {
  readonly type = STOP_LOADING;
}

export type UIActions = StartLoadingAction | StopLoadingAction;
