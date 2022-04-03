import { Test, TestingModule } from '@nestjs/testing';
import { PackagistApiModule } from '../packagist.api/packagist.api.module';
import ComposerVersionPicker from './providers/version-picker.composer';
import NPMVersionPicker from './providers/version-picker.npm';
import { FactoryVersionPickerService } from './version-picker.service';
import { HttpModule } from '@nestjs/axios';
import { NpmApiModule } from '../npm.api/npm.api.module';

describe('VersionPickerService', () => {
  let service: FactoryVersionPickerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PackagistApiModule, HttpModule, NpmApiModule],
      providers: [
        FactoryVersionPickerService,
        NPMVersionPicker,
        ComposerVersionPicker,
      ],
      exports: [],
    }).compile();

    service = module.get<FactoryVersionPickerService>(
      FactoryVersionPickerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('NPM Package get version', async () => {
    const latestVersion = await service.getLatestVersion('npm', 'log4js');

    expect(latestVersion).toMatch(/\d+\.\d+.\d+/);
  });

  it('Composer Package get version', async () => {
    const latestVersion = await service.getLatestVersion(
      'composer',
      'mockery/mockery',
    );

    expect(latestVersion).toMatch(/\d+\.\d+.\d+/);
  });
});
