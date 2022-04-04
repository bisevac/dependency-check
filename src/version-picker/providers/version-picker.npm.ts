import { Injectable } from '@nestjs/common';
import { NpmApiService } from '../../npm.api/npm.api.service';
import { IVersionPicker } from '../version-picker.interface';

@Injectable()
export default class NPMVersionPicker implements IVersionPicker {
  constructor(private npmApiService: NpmApiService) {}

  async getLatestVersion(name): Promise<string> {
    const data = await this.npmApiService.getDistTags(name);
    const latestVersion = data && data.latest ? data.latest : null;

    return latestVersion;
  }
}
