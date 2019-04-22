import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';

import { ApolloConfigModule } from './modules/apollo-config/apollo-config.module';

import { RepositoriesService } from './services/repositories/repositories.service';
import { LoadingComponent } from './components/tools/loading/loading.component';
import { repositoriesActionReducer } from './store/repositories.reducer';
import { StoreModule } from '@ngrx/store';

const routes: Routes = [
  { path: '', component: RepoListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RepoListComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloConfigModule,
    FormsModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({repositories: repositoriesActionReducer })
  ],
  providers: [RepositoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
