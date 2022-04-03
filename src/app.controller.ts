import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  DependencyCheckResponse,
  DependencyCheckUnsubscribeResponse,
} from './app.interface';
import { AppService } from './app.service';
import { generateId } from './common/utils';
import { MailService } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mailService: MailService,
  ) {}

  @Post('dependency-check')
  @HttpCode(200)
  async dependencyCheckRunAndSubscribe(
    @Body('mails') mails: string[],
    @Body('url') url: string,
    @Body('subscribe') subscribe: boolean,
  ): Promise<DependencyCheckResponse> {
    let subscribeId = null;

    if (subscribe) {
      subscribeId = generateId();
      this.appService.subscribeDependencyCheck(subscribeId, mails, url);
    }

    const outdatedDependecyList = await this.appService.dependencyCheckRun(
      subscribeId,
      mails,
      url,
    );

    return { outdatedDependecyList, subscribeId };
  }

  @Post('dependency-check/unsubscribe')
  @HttpCode(200)
  unsubsribeDependencyCheck(
    @Body('subscribeId') subscribeId: string,
  ): DependencyCheckUnsubscribeResponse {
    const r = this.appService.unsubscribeDependencyCheck(subscribeId);

    return { status: r };
  }
}
