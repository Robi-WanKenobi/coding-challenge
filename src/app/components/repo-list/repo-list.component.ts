import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

  constructor(private apollo: Apollo, private repoService: RepositoriesService) { }

  repositories: Array<any> = [];
  repositoryCount: '';
  loading: boolean;
  modalLoading: boolean;
  selectedRepoName: '';
  selectedRepoUrl; '';
  selectedRepoOwner: '';
  selectedRepoOwnerAvatarUrl: '';
  selectedRepoDescription: '';
  selectedRepoContributors: {};
  selectedRepoContributorsCount: number;
  searchTerm: '';
  searched: boolean;
  searchedTerm: '';

  @ViewChild('searchInput') nameField: ElementRef;

  ngOnInit() {
    this.getAllRepos();
  }

  getAllRepos() {
    this.searched = false;
    this.loading = true;
    this.getPublicReposCount();
    this.apollo.watchQuery({ query: Query.MostFavouritedPublicRepos })
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositories = data.edges;
      this.loading = false;
    });
  }

  getPublicReposCount() {
    this.apollo.watchQuery({ query: Query.AllPublicRepos })
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositoryCount = data.repositoryCount;
      this.loading = false;
    });
  }

  fetchRepository(name, url, description, owner, avatarUrl) {
    this.modalLoading = true;
    this.selectedRepoName = name;
    this.selectedRepoUrl = url;
    this.selectedRepoOwner = owner;
    this.selectedRepoOwnerAvatarUrl = avatarUrl;
    this.selectedRepoDescription = description;
    this.getContributors(this.selectedRepoOwner, this.selectedRepoName);
  }

  getContributors(owner, repo) {
    this.repoService.getContributors(owner, repo).then((res) => {
      this.selectedRepoContributors = res;
      this.selectedRepoContributorsCount = Object.keys(this.selectedRepoContributors).length;
      this.modalLoading = false;
    }, (err) => {
      console.log(err);
    });
  }

  search(searchForm) {
    this.loading = true;
    this.searchedTerm = searchForm.value.search;
    this.searched = true;
    this.searchTerm = '';
    this.nameField.nativeElement.blur();
    this.apollo.watchQuery({ query: Query.SearchPublicRepositories,
      variables: {queryString: 'is:public sort:stars ' + searchForm.value.search}})
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositories = data.edges;
      this.repositoryCount = data.repositoryCount;
      this.loading = false;
    });
  }

  clearSearch() {
    this.loading = true;
    this.searchedTerm = '';
    this.searched = false;
    this.searchTerm = '';
    this.getAllRepos();
  }
}
