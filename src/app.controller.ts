import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  DependencyCheckRequestDTO,
  DependencyCheckResponseDTO,
  DependencyCheckUnsubscribeResponseDTO,
  UnSubsribeDependencyCheckRequestDTO,
} from './app.dto';
import { AppService } from './app.service';
import { generateId } from './common/utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('dependency-check')
  @HttpCode(200)
  async dependencyCheckRunAndSubscribe(
    @Body() body: DependencyCheckRequestDTO,
  ): Promise<DependencyCheckResponseDTO> {
    const { mails, url, subscribe } = body;
    let subscribeId = null;

    if (subscribe && mails && mails.length) {
      subscribeId = generateId();
      this.appService.subscribeDependencyCheck(subscribeId, mails, url);
    }

    const outdatedDependecyList =
      await this.appService.getOutdatedDependecyList(url);

    return { outdatedDependecyList, subscribeId } as DependencyCheckResponseDTO;
  }

  @Post('dependency-check/unsubscribe')
  @HttpCode(200)
  unSubsribeDependencyCheck(
    @Body() body: UnSubsribeDependencyCheckRequestDTO,
  ): DependencyCheckUnsubscribeResponseDTO {
    const { subscribeId } = body;
    const r = this.appService.unsubscribeDependencyCheck(subscribeId);

    return { status: r } as DependencyCheckUnsubscribeResponseDTO;
  }
}
