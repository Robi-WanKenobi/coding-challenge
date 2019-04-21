'use strict';

import gql from 'graphql-tag';

export const AllPublicReposCount = gql`{
  search(query: "is:public", type: REPOSITORY, first: 100) {
    repositoryCount
  }
}`;

export const MostStarredPublicRepos = gql`{
  search(query: "is:public stars:>30000 sort:stars", type: REPOSITORY, first: 100) {
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

