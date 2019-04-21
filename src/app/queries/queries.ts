'use strict';

import gql from 'graphql-tag';

export const AllPublicRepositoriesCount = gql`{
  search(query: "is:public", type: REPOSITORY, first: 100) {
    repositoryCount
  }
}`;

export const SearchPublicRepositories = gql`
query searchPublicRepos($queryString: String!) {
  search(query:$queryString, type: REPOSITORY, first: 100) {
    repositoryCount
    edges {
      node {
        ... on Repository {
          name
          url
          description
          stargazers {
            totalCount
          }
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
}`;

