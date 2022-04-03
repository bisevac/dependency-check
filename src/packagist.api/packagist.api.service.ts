import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  IPackagistMetadata,
  IPackagistPackage,
} from './packagist.api.interface';

@Injectable()
export class PackagistApiService {
  private baseApiUrl = 'https://repo.packagist.org';

  constructor(private httpService: HttpService) {}

  /**
   * @APIDOC https://packagist.org/apidoc#get-package-data
   */
  async getPackageMetadata(
    vendor: string,
    pckg: string,
  ): Promise<IPackagistPackage[]> {
    const reqUrl = `${this.baseApiUrl}/p2/${vendor}/${pckg}.json`;

    const response: AxiosResponse<IPackagistMetadata> = await firstValueFrom(
      await this.httpService.get<IPackagistMetadata>(reqUrl, {
        validateStatus: () => true,
      }),
    );

    const { status, data } = response;

    /**
     * @info CONTENT NOT FOUND
     * */
    if (status === 404) {
      return null;
    }

    /**
     * @info UNEXPECTED RESPONSE
     */
    if (status !== 200) {
      throw new Error(
        `Error on github api, status:${status}' 
            data:${JSON.stringify(data)}`,
      );
    }

    const packageData = data.packages[`${vendor}/${pckg}`];

    return packageData;
  }
}
