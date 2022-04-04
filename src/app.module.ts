import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { VersionPickerModule } from './version-picker/version-picker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './cronjob/cronjob.module';
import { ConfigModule } from '@nestjs/config';
import { DependencyCollectorModule } from './dependency-collector/dependency-collector.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailModule,
    VersionPickerModule,
    CronjobModule,
    ScheduleModule.forRoot(),
    DependencyCollectorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
