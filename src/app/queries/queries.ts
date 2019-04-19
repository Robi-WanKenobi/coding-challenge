'use strict';

import gql from 'graphql-tag';

export const AllPublicRepos = gql`{
  search(query: "is:public", type: REPOSITORY, first: 100) {
    repositoryCount
    edges {
      node {
        ... on Repository {
          name
          owner {
            login
            avatarUrl
          }
        }
      }
    }
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
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
}`;

