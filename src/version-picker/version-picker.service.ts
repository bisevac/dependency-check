import { Injectable } from '@nestjs/common';
import ComposerVersionPicker from './providers/version-picker.composer';
import NPMVersionPicker from './providers/version-picker.npm';

@Injectable()
export class FactoryVersionPickerService {
  constructor(
    private npmVersionPicker: NPMVersionPicker,
    private composerVersionPicker: ComposerVersionPicker,
  ) {}

  getLatestVersion(type: string, name: string): Promise<string> {
    switch (type) {
      case 'npm':
        return this.npmVersionPicker.getLatestVersion(name);
      case 'composer':
        return this.composerVersionPicker.getLatestVersion(name);
      default:
        throw new Error('unexpected type');
    }
  }
}
