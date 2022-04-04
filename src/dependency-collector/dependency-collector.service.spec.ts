import { Test, TestingModule } from '@nestjs/testing';
import { GithubApiModule } from '../github.api/github.api.module';
import { DependencyCollectorService } from './dependency-collector.service';
import { DependencyCollectorComposerService } from './providers/dependency-collector.service.composer';
import { DependencyCollectorNPMService } from './providers/dependency-collector.service.npm';

describe('DependencyCollectorService', () => {
  let service: DependencyCollectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubApiModule],
      providers: [
        DependencyCollectorService,
        DependencyCollectorComposerService,
        DependencyCollectorNPMService,
      ],
    }).compile();

    service = module.get<DependencyCollectorService>(
      DependencyCollectorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('composer project test', async () => {
    const dependencyList = await service.githubGetDependencyList(
      'https://github.com/codefresh-contrib/php-composer-sample-app',
    );

    expect(dependencyList).toBeInstanceOf(Array);
    expect(dependencyList.length).toBeGreaterThan(0);
  });

  it('npm project test', async () => {
    const dependencyList = await service.githubGetDependencyList(
      'https://github.com/nestjs/nest',
    );
    expect(dependencyList).toBeInstanceOf(Array);
    expect(dependencyList.length).toBeGreaterThan(0);
  });
});
