import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import * as Config from '../../config/config';
import { Apollo } from 'apollo-angular';
import * as Query from '../../queries/queries';
import { Repositories} from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {
  private searchQuery: string;
  private repositoryCount: number;
  private searchResult: Repositories = new Repositories();

  constructor(private http: HttpClient, private apollo: Apollo) { }

  static formatString(str) {
    if (str == null) {
      return str;
    }
    str = str.replace(/^\s+/g, '');
    str = str.replace(/\s+$/g, '');
    return str.toLowerCase();
  }

  getContributors(owner, repo) {
    return new Promise((resolve, reject) => {
      this.http.get(Config.gitHubApiRestRootUrl + 'repos/' + owner + '/' + repo + '/contributors')
        .map(res => res)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  searchPublicRepositories(searchedTerms, minStars, orderDirection, cursor) {
    this.searchQuery = '';
    for (const term of searchedTerms) {
      this.searchQuery = this.searchQuery + ' ' + term;
      this.searchQuery = RepositoriesService.formatString(this.searchQuery);
    }
    const starsQuery = 'stars:>=' + minStars;

    if (cursor) {
      return this.doFetch(orderDirection, starsQuery, cursor);
    } else {
      return this.doSearch(orderDirection, starsQuery);
    }

  }

  doSearch(orderDirection, starsQuery) {
    return new Promise<Repositories>((resolve, reject) => {
      this.apollo.watchQuery({
        query: Query.SearchPublicRepositories,
        variables: {queryString: 'is:public sort:stars-' + orderDirection + ' ' + starsQuery + ' ' + this.searchQuery,
          numResults: 25}
      })
        .valueChanges
        .map((res: any) => res.data.search)
        .subscribe((res) => {
          this.searchResult.repositoryList = res.edges;
          this.searchResult.repositoryCount = res.repositoryCount;
          this.searchResult.hasNextPage = res.pageInfo.hasNextPage;
          this.searchResult.endCursor = res.pageInfo.endCursor;
          resolve(this.searchResult);
        }, (err) => {
          reject(err);
        });
    });
  }

  doFetch(orderDirection, starsQuery, cursor) {
    return new Promise<Repositories>((resolve, reject) => {
      this.apollo.watchQuery({
        query: Query.LoadMorePublicRepositories,
        variables: {queryString: 'is:public sort:stars-' + orderDirection + ' ' + starsQuery + ' ' + this.searchQuery,
          numResults: 25,
          afterCursor: cursor}
      })
        .valueChanges
        .map((res: any) => res.data.search)
        .subscribe((res) => {
          this.searchResult.repositoryList = res.edges;
          this.searchResult.repositoryCount = res.repositoryCount;
          this.searchResult.hasNextPage = res.pageInfo.hasNextPage;
          this.searchResult.endCursor = res.pageInfo.endCursor;
          resolve(this.searchResult);
        }, (err) => {
          reject(err);
        });
    });
  }
}
