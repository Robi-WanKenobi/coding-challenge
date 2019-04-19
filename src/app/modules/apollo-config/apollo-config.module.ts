import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo, ApolloModule} from 'apollo-angular';
import { HttpLink , HttpLinkModule} from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class ApolloConfigModule {

  token = 'a1dc1e98820f452cd8435beba4449e617a12c693';

  authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: this.token ? `Bearer ${this.token}` : null,
      }
    };
  });

  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({ link: this.authLink.concat(createHttpLink({ uri: 'https://api.github.com/graphql' })), cache: new InMemoryCache()});
  }
}
