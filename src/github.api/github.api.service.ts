import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { base64ToString } from '../common/utils';
import { IContent } from './github.api.interface';

@Injectable()
export class GithubApiService {
  private baseApiUrl = 'https://api.github.com';

  constructor(private httpService: HttpService) {}

  /**
   * @APIDOC https://docs.github.com/en/rest/reference/repos#get-repository-content
   */
  async getContent(
    owner: string,
    repo: string,
    contentPath: string,
  ): Promise<string | null> {
    const reqUrl = `${this.baseApiUrl}/repos/${owner}/${repo}/contents/${contentPath}`;

    const response: AxiosResponse<IContent> = await firstValueFrom(
      await this.httpService.get<IContent>(reqUrl, {
        validateStatus: () => true,
      }),
    );

    const { data, status } = response;

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

    /**
     * @info IF CONTENT IS NOT FILE
     */
    if (!data.content) {
      return null;
    }

    const asciiContent = base64ToString(data.content);

    return asciiContent;
  }
}
