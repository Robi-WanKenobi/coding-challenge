import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import * as Config from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  constructor(private http: HttpClient) { }

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
}
