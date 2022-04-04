import { Injectable } from '@nestjs/common';
import { IPackagistPackage } from '../../packagist.api/packagist.api.interface';
import { PackagistApiService } from '../../packagist.api/packagist.api.service';
import { IVersionPicker } from '../version-picker.interface';

@Injectable()
export default class ComposerVersionPicker implements IVersionPicker {
  constructor(private packagistApiService: PackagistApiService) {}

  async getLatestVersion(name: string): Promise<string> {
    const [vendor, pckg] = name.split('/');

    const packageMetadata: IPackagistPackage[] =
      await this.packagistApiService.getPackageMetadata(vendor, pckg);

    const latestVersion =
      packageMetadata && packageMetadata[0] ? packageMetadata[0].version : null;

    return latestVersion;
  }
}
