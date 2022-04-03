import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NpmApiModule } from '../npm.api/npm.api.module';
import { PackagistApiModule } from '../packagist.api/packagist.api.module';
import ComposerVersionPicker from './providers/version-picker.composer';
import NPMVersionPicker from './providers/version-picker.npm';
import { FactoryVersionPickerService } from './version-picker.service';

@Module({
  imports: [PackagistApiModule, HttpModule, NpmApiModule],
  providers: [
    FactoryVersionPickerService,
    NPMVersionPicker,
    ComposerVersionPicker,
  ],
  exports: [FactoryVersionPickerService],
})
export class VersionPickerModule {}
