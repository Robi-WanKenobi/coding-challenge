import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as Query from '../../queries/queries';
import 'rxjs/add/operator/map';
import {RepositoriesService} from '../../services/repositories/repositories.service';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {

  repositories: Array<any> = [];
  repositoryCount: '';
  loading: boolean;
  modalLoading: boolean;
  selectedRepoName: '';
  selectedRepoOwner: '';
  selectedRepoOwnerAvatarUrl: '';
  selectedRepoContributors: {};
  selectedRepoContributorsCount: number;

  constructor(private apollo: Apollo, private repoService: RepositoriesService) { }

  ngOnInit() {
    this.modalLoading = false;
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
    this.getContributors(this.selectedRepoOwner, this.selectedRepoName);
  }

  search(searchForm) {
    this.loading = true;
    this.apollo.watchQuery({ query: Query.SearchPublicRepositories, variables: {queryString: 'is:public ' + searchForm.value.search}})
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositories = data.edges;
      this.repositoryCount = data.repositoryCount;
      this.loading = false;
    });
  }

  getContributors(owner, repo) {
    this.modalLoading = true;
    this.repoService.getContributors(owner, repo).then((res) => {
      this.selectedRepoContributors = res;
      this.selectedRepoContributorsCount = Object.keys(this.selectedRepoContributors).length;
      this.modalLoading = false;
    }, (err) => {
      console.log(err);
    });
  }
}
