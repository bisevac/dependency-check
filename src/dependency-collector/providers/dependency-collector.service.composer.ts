import { Injectable } from '@nestjs/common';
import { GithubApiService } from '../../github.api/github.api.service';
import {
  Dependency,
  DependencyList,
  EDependencyType,
  IComposerJson,
} from '../dependecy-collector.interface';

@Injectable()
export class DependencyCollectorComposerService {
  constructor(private githubApiService: GithubApiService) {}

  async githubGetDependencyList(url: string): Promise<DependencyList> {
    const dependencyList: DependencyList = [];
    const [repo, owner] = url
      .trim()
      .replace(/\.git$/, '')
      .split('/')
      .reverse();

    const composerPackageJson: IComposerJson = JSON.parse(
      await this.githubApiService.getContent(owner, repo, 'composer.json'),
    );

    if (composerPackageJson) {
      const composerPackages = composerPackageJson.require;

      const composerMappedPackages: DependencyList = Object.keys(
        composerPackages,
      ).map((p) => {
        return {
          type: EDependencyType.composer,
          packageName: p,
          version: composerPackages[p],
        } as Dependency;
      });

      dependencyList.push(...composerMappedPackages);
    }

    return dependencyList;
  }
}
