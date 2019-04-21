export class Stargazer {
  totalCount: number;

  constructor() {}
}

export class Owner {
  login: string;
  avatarUrl: string;

  constructor() {}
}

export class Repository {
  name: string;
  description: string;
  url: string;
  stargazers: Stargazer;
  owner: Owner;

  constructor() {
    this.name = '';
    this.description = '';
    this.url = '';
    this.owner = new Owner();
  }
}

export class Repositories {
  repositoryList: Repository[];
  repositoryCount: string;

  constructor() {
    this.repositoryList = new Array<Repository>(100);
    this.repositoryCount = '';
  }
}
