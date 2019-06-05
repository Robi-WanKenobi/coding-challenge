import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { RepositoriesService } from '../../services/repositories/repositories.service';
import {Owner, Repositories, Repository} from '../../models/models';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { RepositoriesGetAction } from '../../store/repositories.action';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {

  searchResult = new Repositories();
  repositories: Array<Repository> = [];
  repositoryCount: number;
  selectedRepository: Repository;
  selectedRepoOwner: Owner;
  selectedRepoContributors: {};
  selectedRepoContributorsCount: number;
  searchTerm: '';
  searchedTerms: Array<string> = [];
  orderDirection = 'asc';
  endCursor: string;

  loading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  modalLoading: boolean;
  searched: boolean;
  results: boolean;
  error: boolean;
  contributorsError: boolean;

  @ViewChild('searchInput') searchField: ElementRef;
  @ViewChild('filtersContainer') filtersField: ElementRef;

  value = 0;
  minStars = this.value;
  options: Options = {
    floor: 0,
    ceil: 75000,
    step: 100,
  }

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
    this.loadingMore = false;
    this.searched = false;
    this.search(this.searchedTerms);
  }

  // Function to search by search terms, minimum stars and ordered by
  search(searchedTerms) {
    this.loading = true;
    this.repoService.searchPublicRepositories(searchedTerms, this.minStars, this.orderDirection, null).then((res) => {
      this.store.dispatch(new RepositoriesGetAction(res));
      this.repositories = this.searchResult.repositoryList;
      this.repositoryCount = this.searchResult.repositoryCount;
      this.hasNextPage = this.searchResult.hasNextPage;
      this.endCursor = this.searchResult.endCursor;
      if (this.repositoryCount !== 0) {
        this.results = true;
        this.searched = true;
      } else {
        this.results = false;
      }
      this.error = false;
      this.loading = false;
    }, (err) => {
      this.error = true;
      this.loading = false;
    });

  }

  // Get repository basic information
  fetchRepository(name, url, description, owner, avatarUrl) {
    this.modalLoading = true;
    this.selectedRepoOwner = new Owner(owner, avatarUrl);
    this.selectedRepository = new Repository(name, description, url, this.selectedRepoOwner);
    this.getContributors(owner, name);
  }

  // Get the input repository contributors
  getContributors(owner, repo) {
    this.repoService.getContributors(owner, repo).then((res) => {
      this.selectedRepoContributors = res;
      this.selectedRepoContributorsCount = Object.keys(this.selectedRepoContributors).length;
      this.modalLoading = false;
      this.contributorsError = false;
    }, (err) => {
      this.selectedRepoContributors = [];
      this.modalLoading = false;
      this.contributorsError = true;
    });
  }

  // Add text inputs to the search terms
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

  // Remove term from the search terms
  removeSearchTerm(term) {
    this.loading = true;
    const index = this.searchedTerms.indexOf(term, 0);
    this.searchedTerms.splice(index, 1);
    this.search(this.searchedTerms);
  }

  // Check if text input is already in the search terms
  isAlreadySearched(searchTerm) {
    for (const term of this.searchedTerms) {
      if (term.localeCompare(searchTerm) === 0) {
        return true;
      }
    }
    return false;
  }

  // Sets the minimum stars
  starRange(minStars) {
    this.minStars = minStars;
    this.search(this.searchedTerms);
  }

  // Order by ASC or DESC number of stars
  orderByStars() {
    if (this.orderDirection.localeCompare('desc') === 0) {
      this.orderDirection = 'asc';
    } else {
      this.orderDirection = 'desc';
    }
    this.search(this.searchedTerms);
  }

  // Function to show more results
  showMoreResults() {
    this.loadingMore = true;
    this.repoService.searchPublicRepositories(this.searchedTerms, this.minStars, this.orderDirection, this.endCursor).then((res) => {
      this.store.dispatch(new RepositoriesGetAction(res));
      this.repositories = this.repositories.concat(this.searchResult.repositoryList);
      this.hasNextPage = this.searchResult.hasNextPage;
      this.endCursor = this.searchResult.endCursor;
      if (this.repositoryCount !== 0) {
        this.results = true;
        this.searched = true;
      } else {
        this.results = false;
      }
      this.error = false;
      this.loadingMore = false;
    }, (err) => {
      this.error = true;
      this.loadingMore = false;
    });
  }

  // Clears 'shake' class used for the search terms error animation
  clearFiltersClass() {
    this.renderer.removeClass(this.filtersField.nativeElement, 'shake');
  }
}
