'use strict';

import gql from 'graphql-tag';

export const SearchPublicRepositories = gql`
query searchPublicRepos($queryString: String!, $numResults: Int!) {
  search(query:$queryString, type: REPOSITORY, first: $numResults) {
    pageInfo {
      hasNextPage
      endCursor
    }
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

export const LoadMorePublicRepositories = gql`
query searchPublicRepos($queryString: String!, $numResults: Int!, $afterCursor: String!) {
  search(query:$queryString, type: REPOSITORY, first: $numResults, after: $afterCursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
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

