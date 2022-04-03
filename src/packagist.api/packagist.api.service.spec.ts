import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PackagistApiService } from './packagist.api.service';

describe('PackagistApiService', () => {
  let service: PackagistApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PackagistApiService],
    }).compile();

    service = module.get<PackagistApiService>(PackagistApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('exists composer package', async () => {
    const packageData = await service.getPackageMetadata('mockery', 'mockery');

    expect(packageData.length).toBeGreaterThan(0);
  });

  it('not exists composer package', async () => {
    const packageData = await service.getPackageMetadata(
      'anyvendor',
      'notexists',
    );

    expect(packageData).toBeNull();
  });
});
