import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { GithubApiService } from './github.api.service';

describe('Github.ApiService', () => {
  let service: GithubApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GithubApiService],
    }).compile();

    service = module.get<GithubApiService>(GithubApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('exists content', async () => {
    const content = await service.getContent(
      'octocat',
      'Hello-World',
      'README',
    );

    expect(content).toContain('Hello World!');
  });

  it('not exists content', async () => {
    const content = await service.getContent(
      'octocat',
      'Hello-World',
      'not-exists.txt',
    );

    expect(content).toBeNull();
  });
});
