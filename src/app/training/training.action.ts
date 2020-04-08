import { Action } from "@ngrx/store";
import { Exercise } from "./exercise.model";

export const SET_AVAILABLE_TRAININGS = "[Training] Set Available Trainings";
export const SET_FINISHED_TRAININGS = "[Training] Set Finished Trainings";
export const START_TRAINING = "[Training] Start Training";
export const STOP_TRAINING = "[Training] Stop Training";

export class SetAvailableTrainingsAction implements Action {
  readonly type = SET_AVAILABLE_TRAININGS;
  constructor(public payload: Exercise[]) {}
}

export class SetFinishedTrainingsAction implements Action {
  readonly type = SET_FINISHED_TRAININGS;
  constructor(public payload: Exercise[]) {}
}

export class StartTrainingAction implements Action {
  readonly type = START_TRAINING;
  constructor(public payload: string) {}
}

export class StopTrainingAction implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions =
  | SetAvailableTrainingsAction
  | SetFinishedTrainingsAction
  | StartTrainingAction
  | StopTrainingAction;
