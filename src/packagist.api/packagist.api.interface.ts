export interface IPackagistMetadata {
  packages: {
    [key: string]: IPackagistPackage[];
  };
}

export interface IPackagistPackage {
  name: string;
  description: string;
  version: string;
  version_normalized: string;
  keywords: string[];
  homepage: string;
}
