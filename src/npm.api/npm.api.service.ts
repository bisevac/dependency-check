import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { INPMDistTags } from './npm.api.interface';

@Injectable()
export class NpmApiService {
  private baseApiUrl = 'https://registry.npmjs.org';

  constructor(private httpService: HttpService) {}

  /**
   * @ApiDoc https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
   */
  async getDistTags(name: string): Promise<INPMDistTags> {
    const reqUrl = `${this.baseApiUrl}/-/package/${name}/dist-tags`;

    const response: AxiosResponse<INPMDistTags> = await firstValueFrom(
      await this.httpService.get<INPMDistTags>(reqUrl, {
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

    return data;
  }
}
