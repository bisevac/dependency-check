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
