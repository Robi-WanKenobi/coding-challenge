export class Owner {
  login: string;
  avatarUrl: string;

  constructor(login, avatar) {
    this.login = login;
    this.avatarUrl = avatar;
  }
}

export class Repository {
  name: string;
  description: string;
  url: string;
  owner: Owner;

  constructor(name, description, url, owner) {
    this.name = name;
    this.description = description;
    this.url = url;
    this.owner = new Owner(owner.login, owner.avatarUrl);
  }
}

export class Repositories {
  repositoryList: Repository[];
  repositoryCount: number;
  hasNextPage: boolean;
  endCursor: string;

  constructor() {
    this.repositoryList = new Array<Repository>(100);
    this.repositoryCount = 0;
  }
}
