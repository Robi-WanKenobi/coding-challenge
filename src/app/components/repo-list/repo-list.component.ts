import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { RepositoriesService } from '../../services/repositories/repositories.service';
import {Owner, Repositories, Repository} from '../../models/models';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import {RepositoriesGetAction} from '../../store/repositories.action';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {

  searchResult = new Repositories();
  repositories: Array<Repository> = [];
  repositoryCount: string;
  totalRepositoryCount: string;
  selectedRepository: Repository;
  selectedRepoOwner: Owner;
  selectedRepoContributors: {};
  searchTerm: '';
  searchedTerms: Array<string> = [];

  loading: boolean;
  modalLoading: boolean;
  searched: boolean;
  results: boolean;

  @ViewChild('searchInput') searchField: ElementRef;
  @ViewChild('filtersContainer') filtersField: ElementRef;

  constructor(private apollo: Apollo,
              private repoService: RepositoriesService,
              private renderer: Renderer2,
              public store: Store<AppState>) {
    this.store.pipe(select(state => state.repositories))
      .subscribe(repositories => {
        if (repositories) {
          this.searchResult = repositories.repositories;
        }
      });
  }

  ngOnInit() {
    this.loading = true;
    this.searched = false;
    this.getPublicReposCount();
    this.search(this.searchedTerms);
  }

  getPublicReposCount() {
    this.repoService.getAllPublicRepositoriesCount().then((res) => {
      this.totalRepositoryCount = res.toString();
      this.repositoryCount = this.totalRepositoryCount;
    }, (err) => {
      console.log(err);
    });
  }

  search(searchedTerms) {
    this.loading = true;
    this.repoService.searchPublicRepositories(searchedTerms).then((res) => {
      this.store.dispatch(new RepositoriesGetAction(res));
      this.repositories = this.searchResult.repositoryList;
      if (searchedTerms.length === 0) {
        this.repositoryCount = this.totalRepositoryCount;
      } else {
        this.repositoryCount = this.searchResult.repositoryCount;
      }
      if (this.repositoryCount !== '0') {
        this.results = true;
        this.searched = true;
      } else {
        this.results = false;
      }
      this.loading = false;
    }, (err) => {
      console.log(err);
    });
  }

  fetchRepository(name, url, description, owner, avatarUrl) {
    this.modalLoading = true;
    this.selectedRepoOwner = new Owner(owner, avatarUrl);
    this.selectedRepository = new Repository(name, description, url, this.selectedRepoOwner);
    this.getContributors(owner, name);
  }

  getContributors(owner, repo) {
    this.repoService.getContributors(owner, repo).then((res) => {
      this.selectedRepoContributors = res;
      this.modalLoading = false;
    }, (err) => {
      console.log(err);
    });
  }

  addSearchTerm(searchForm) {
    let term = searchForm.value.search;
    term = RepositoriesService.formatString(term);
    if (term.length !== 0 && (term !== '' || !term)) {
      if (!this.isAlreadySearched(term)) {
        this.searchedTerms.push(term);
        this.search(this.searchedTerms);
      } else {
        this.renderer.addClass(this.filtersField.nativeElement, 'shake');
      }
      this.renderer.selectRootElement(this.searchField.nativeElement).blur();
    }
    this.searchTerm = '';
  }

  removeSearchTerm(term) {
    this.loading = true;
    const index = this.searchedTerms.indexOf(term, 0);
    this.searchedTerms.splice(index, 1);
    this.search(this.searchedTerms);
  }

  isAlreadySearched(searchTerm) {
    for (const term of this.searchedTerms) {
      if (term.localeCompare(searchTerm) === 0) {
        return true;
      }
    }
    return false;
  }

  clearFiltersClass() {
    this.renderer.removeClass(this.filtersField.nativeElement, 'shake');
  }
}
