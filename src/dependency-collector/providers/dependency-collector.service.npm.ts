import { Injectable } from '@nestjs/common';
import { GithubApiService } from '../../github.api/github.api.service';
import {
  Dependency,
  DependencyList,
  EDependencyType,
  INPMPackageJson,
} from '../dependecy-collector.interface';

@Injectable()
export class DependencyCollectorNPMService {
  constructor(private githubApiService: GithubApiService) {}

  async githubGetDependencyList(url: string): Promise<DependencyList> {
    const dependencyList: DependencyList = [];
    const [repo, owner] = url
      .trim()
      .replace(/\.git$/, '')
      .split('/')
      .reverse();

    const npmPackageJson: INPMPackageJson = JSON.parse(
      await this.githubApiService.getContent(owner, repo, 'package.json'),
    );

    if (npmPackageJson) {
      const npmPackages = npmPackageJson.dependencies;

      const npmMappedPackages: DependencyList = Object.keys(npmPackages).map(
        (p) => {
          return {
            type: EDependencyType.npm,
            packageName: p,
            version: npmPackages[p],
          } as Dependency;
        },
      );

      dependencyList.push(...npmMappedPackages);
    }

    return dependencyList;
  }
}
