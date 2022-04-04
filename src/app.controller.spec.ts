import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronjobModule } from './cronjob/cronjob.module';
import { DependencyCollectorModule } from './dependency-collector/dependency-collector.module';
import { GithubApiModule } from './github.api/github.api.module';
import { MailModule } from './mail/mail.module';
import { NpmApiModule } from './npm.api/npm.api.module';
import { PackagistApiModule } from './packagist.api/packagist.api.module';
import { VersionPickerModule } from './version-picker/version-picker.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MailModule,
        GithubApiModule,
        VersionPickerModule,
        PackagistApiModule,
        VersionPickerModule,
        NpmApiModule,
        CronjobModule,
        DependencyCollectorModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController);
    });
  });
});
