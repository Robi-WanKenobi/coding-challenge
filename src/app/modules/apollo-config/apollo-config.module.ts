import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo, ApolloModule} from 'apollo-angular';
import { HttpLink , HttpLinkModule} from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import * as Config from '../../config/config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class ApolloConfigModule {

  token = Config.gitHubToken;

  authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: this.token ? `Bearer ${this.token}` : null,
      }
    };
  });

  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({ link: this.authLink.concat(createHttpLink({ uri: Config.gitHubGraphqlRootUrl })), cache: new InMemoryCache()});
  }
}
