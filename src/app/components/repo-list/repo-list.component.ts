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
  repositoryCount: number;
  loading = true;
  modalLoading: boolean;
  selectedRepoName: '';
  selectedRepoUrl; '';
  selectedRepoOwner: '';
  selectedRepoOwnerAvatarUrl: '';
  selectedRepoDescription: '';
  selectedRepoContributors: {};
  selectedRepoContributorsCount: number;
  searchTerm: '';
  searchedTerms: Array<string> = [];
  searchQuery: string;
  searched: boolean;
  results: boolean;

  @ViewChild('searchInput') nameField: ElementRef;

  ngOnInit() {
    this.getAllRepos();
    this.loading = true;
  }

  getAllRepos() {
    this.searched = false;
    this.loading = true;
    this.getPublicReposCount();
    this.apollo.watchQuery({ query: Query.MostStarredPublicRepos })
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositories = data.edges;
      this.loading = false;
      this.results = true;
    });
  }

  getPublicReposCount() {
    this.apollo.watchQuery({ query: Query.AllPublicReposCount })
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositoryCount = data.repositoryCount;
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

  addSearchTerm(searchForm) {
    let term = searchForm.value.search;
    term = this.ltrim(term);
    term = this.rtrim(term);
    if (term.length !== 0 && (term !== '' || !term)) {
      this.searchedTerms.push(term);
      this.search(this.searchedTerms);
      this.searchTerm = '';
      this.nameField.nativeElement.blur();
    }
  }

  removeSearchTerm(term) {
    const index = this.searchedTerms.indexOf(term, 0);
    this.searchedTerms.splice(index, 1);
    this.loading = true;
    if (this.searchedTerms.length === 0) {
      this.searched = false;
      this.getAllRepos();
    } else {
        this.search(this.searchedTerms);
    }
  }

  search(searchTerms) {
    this.loading = true;
    this.searchQuery = '';
    for (const term of searchTerms) {
      this.searchQuery = this.searchQuery + ' ' + term;
      this.searchQuery = this.ltrim(this.searchQuery);
    }
    this.apollo.watchQuery({
      query: Query.SearchPublicRepositories,
      variables: {queryString: 'is:public sort:stars ' + this.searchQuery}
    })
      .valueChanges
      .map((result: any) => result.data.search).subscribe((data) => {
      this.repositories = data.edges;
      this.repositoryCount = data.repositoryCount;
      if (this.repositoryCount !== 0) {
        this.results = true;
        this.searched = true;
      } else {
        this.results = false;
      }
      this.loading = false;
    });
    }

  ltrim(str) {
    if (str == null) {
      return str;
    }
    return str.replace(/^\s+/g, '');
  }

  rtrim(str) {
    if (str == null) {
      return str;
    }
    return str.replace(/\s+$/g, '');
  }
}
