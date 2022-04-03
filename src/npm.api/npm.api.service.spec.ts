import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { NpmApiService } from './npm.api.service';

describe('NpmApiService', () => {
  let service: NpmApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [NpmApiService],
    }).compile();

    service = module.get<NpmApiService>(NpmApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('exists npm package', async () => {
    const tags = await service.getDistTags('log4js');

    expect(tags).toHaveProperty('latest');
  });

  it('not exists npm package', async () => {
    const tags = await service.getDistTags('log4james');

    expect(tags).toBeNull();
  });
});
