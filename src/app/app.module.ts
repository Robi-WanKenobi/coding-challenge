import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';
import { RepoDetailComponent } from './components/repo-detail/repo-detail.component';

import { ApolloConfigModule } from './modules/apollo-config/apollo-config.module';

import { RepositoriesService } from './services/repositories/repositories.service';
import { LoadingComponent } from './components/tools/loading/loading.component';

const routes: Routes = [
  { path: '', component: RepoListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RepoListComponent,
    RepoDetailComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloConfigModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [RepositoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
