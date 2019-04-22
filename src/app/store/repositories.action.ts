import { Action } from '@ngrx/store';
import { Repositories } from '../models/models';

export namespace RepositoriesActionTypes {
  export const GET = '[Repositories] get';
}

export class RepositoriesGetAction implements Action {
  readonly type = RepositoriesActionTypes.GET;
  public payload: Repositories;

  constructor(public repositories: Repositories) {
    this.payload = this.repositories;
  }
}

export type RepositoriesAction = RepositoriesGetAction;
