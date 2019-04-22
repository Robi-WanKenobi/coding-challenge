import { RepositoriesState } from './repositories.state';
import { RepositoriesAction, RepositoriesActionTypes} from './repositories.action';
import { Repositories } from '../models/models';

const initialRepositoriesState: RepositoriesState = {
  repositories: new Repositories()
};

export function repositoriesActionReducer(state: RepositoriesState = initialRepositoriesState,
                                          action: RepositoriesAction): RepositoriesState {
  switch (action.type) {
    case RepositoriesActionTypes.GET:
      state.repositories = (action.payload);
      return {
        repositories: state.repositories
      };
  }
}
