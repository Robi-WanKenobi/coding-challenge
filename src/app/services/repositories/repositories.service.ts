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

  getAllPublicRepositoriesCount() {
    return new Promise<number>((resolve, reject) => {
      this.apollo.watchQuery({ query: Query.AllPublicRepositoriesCount })
        .valueChanges
        .map((res: any) => res.data.search)
        .subscribe((res) => {
          this.repositoryCount = res.repositoryCount;
          resolve(this.repositoryCount);
        }, (err) => {
          reject(err);
        });
    });
  }

  searchPublicRepositories(searchedTerms) {
    this.searchQuery = '';
    for (const term of searchedTerms) {
      this.searchQuery = this.searchQuery + ' ' + term;
      this.searchQuery = RepositoriesService.formatString(this.searchQuery);
    }
    let mostStarred = '';
    if (searchedTerms.length === 0) {
      mostStarred = 'stars:>30000';
    }
    return new Promise<Repositories>((resolve, reject) => {
      this.apollo.watchQuery({
        query: Query.SearchPublicRepositories,
        variables: {queryString: 'is:public sort:stars ' + mostStarred + ' ' + this.searchQuery}
      })
        .valueChanges
        .map((res: any) => res.data.search)
        .subscribe((res) => {
          this.searchResult.repositoryList = res.edges;
          this.searchResult.repositoryCount = res.repositoryCount;
          resolve(this.searchResult);
        }, (err) => {
          reject(err);
        });
    });
  }
}
