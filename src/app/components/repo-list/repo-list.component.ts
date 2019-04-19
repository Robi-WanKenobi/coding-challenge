import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as Query from '../../queries/queries';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {

  repositories: Array<any> = [];
  repositoryCount: '';
  loading: boolean;
  selectedRepoName: '';
  selectedRepoOwner: '';
  selectedRepoOwnerAvatarUrl: '';

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.loading = true;
    this.getAllRepos();
  }

  getAllRepos() {
    this.apollo.watchQuery({ query: Query.AllPublicRepos })
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositories = data.edges;
      this.repositoryCount = data.repositoryCount;
      this.loading = false;
    });
  }

  fetchRepository(name, owner, avatarUrl) {
    this.selectedRepoName = name;
    this.selectedRepoOwner = owner;
    this.selectedRepoOwnerAvatarUrl = avatarUrl;
  }

  search(searchTerm: string) {
    if (searchTerm.length >= 3) {
      this.loading = true;
      this.apollo.watchQuery({ query: Query.SearchPublicRepositories, variables: {queryString: 'is:public ' + searchTerm}})
        .valueChanges
        .map((result: any) => result.data.search).subscribe((data) => {
        this.repositories = data.edges;
        this.repositoryCount = data.repositoryCount;
        this.loading = false;
      });
    }
  }
}
