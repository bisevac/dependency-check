import { Injectable } from '@nestjs/common';
import { NpmApiService } from '../../npm.api/npm.api.service';

@Injectable()
export default class NPMVersionPicker {
  constructor(private npmApiService: NpmApiService) {}

  async getLatestVersion(name): Promise<string> {
    const data = await this.npmApiService.getDistTags(name);
    const latestVersion = data && data.latest ? data.latest : null;

    return latestVersion;
  }
}
