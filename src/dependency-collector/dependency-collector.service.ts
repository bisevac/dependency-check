import { Injectable } from '@nestjs/common';
import { DependencyList } from './dependecy-collector.interface';
import { DependencyCollectorComposerService } from './providers/dependency-collector.service.composer';
import { DependencyCollectorNPMService } from './providers/dependency-collector.service.npm';

@Injectable()
export class DependencyCollectorService {
  constructor(
    private dependencyCollectorNPMService: DependencyCollectorNPMService,
    private dependencyCollectorComposerService: DependencyCollectorComposerService,
  ) {}

  async githubGetDependencyList(url): Promise<DependencyList> {
    const dependencyList: DependencyList = [];

    const npmDependencyList: DependencyList =
      await this.dependencyCollectorNPMService.githubGetDependencyList(url);

    const composerDependencyList: DependencyList =
      await this.dependencyCollectorComposerService.githubGetDependencyList(
        url,
      );

    dependencyList.push(...npmDependencyList, ...composerDependencyList);

    return dependencyList;
  }
}
