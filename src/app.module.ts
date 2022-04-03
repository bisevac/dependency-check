import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { GithubApiModule } from './github.api/github.api.module';
import { VersionPickerModule } from './version-picker/version-picker.module';
import { PackagistApiModule } from './packagist.api/packagist.api.module';
import { NpmApiModule } from './npm.api/npm.api.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './cronjob/cronjob.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailModule,
    GithubApiModule,
    VersionPickerModule,
    PackagistApiModule,
    VersionPickerModule,
    NpmApiModule,
    CronjobModule,
    ScheduleModule.forRoot(),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
