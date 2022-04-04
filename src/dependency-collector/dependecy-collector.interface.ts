export type DependencyList = Dependency[];

export type Dependency = {
  type: EDependencyType;
  packageName: string;
  version: string;
};

export type OutdatedDependecy = {
  type: EDependencyType;
  packageName: string;
  currentVersion: string;
  latestVersion: string;
};

export enum EDependencyType {
  composer = 'composer',
  npm = 'npm',
}

export interface IComposerJson {
  name: string;
  description: string;
  keywords: string;
  homepage: string;
  license: string;
  require: {
    [key: string]: string;
  };
  'require-dev': {
    [key: string]: string;
  };
}

export interface INPMPackageJson {
  name: string;
  version: string;
  description: string;
  author: string;
  private: string;
  license: string;
  dependencies: {
    [key: string]: string;
  };
}
