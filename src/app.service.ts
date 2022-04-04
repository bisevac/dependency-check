import { Injectable } from '@nestjs/common';
import { Dependency, DependencyList, OutdatedDependecy } from './app.interface';
import { versionCompare, versionFormater } from './common/utils';
import { CronjobService } from './cronjob/cronjob.service';
import { DependencyCollectorService } from './dependency-collector/dependency-collector.service';
import { MailService } from './mail/mail.service';
import { FactoryVersionPickerService } from './version-picker/version-picker.service';

@Injectable()
export class AppService {
  constructor(
    private versionPicker: FactoryVersionPickerService,
    private cronjobService: CronjobService,
    private dependencyCollectorService: DependencyCollectorService,
    private mailService: MailService,
  ) {
    this.loadDependencyJobs();
  }

  async getOutdatedDependecyList(url: string): Promise<OutdatedDependecy[]> {
    const outDatedDependecyList: OutdatedDependecy[] = [];

    const dependencyList: DependencyList =
      await this.dependencyCollectorService.githubGetDependencyList(url);

    for (let i = 0; i < dependencyList.length; i++) {
      const dependency: Dependency = dependencyList[i];

      const { type, version, packageName } = dependency;

      const latestVersion: string = await this.versionPicker.getLatestVersion(
        type,
        packageName,
      );

      if (latestVersion) {
        const vCompare = versionCompare(
          versionFormater(version),
          versionFormater(latestVersion),
        );

        if (vCompare === -1) {
          outDatedDependecyList.push({
            type,
            packageName,
            latestVersion,
            currentVersion: version,
          } as OutdatedDependecy);
        }
      }
    }

    return outDatedDependecyList;
  }

  private async dependencyCheckAndSendEmail(
    subscribeId: string,
    mails: string[],
    url: string,
  ): Promise<OutdatedDependecy[]> {
    const outdatedDependecyList: OutdatedDependecy[] =
      await this.getOutdatedDependecyList(url);

    const mailData = {
      to: mails,
      subject: `${url} Dependecy Check SubscribeId: ${subscribeId}`,
      text: `${url} outdated dependency list:`,
      html: JSON.stringify(outdatedDependecyList, null, 2),
    };

    console.info('sending email', mailData);
    await this.mailService.send(mailData);

    return outdatedDependecyList;
  }

  unsubscribeDependencyCheck(subscribeId: string): boolean {
    return this.cronjobService.deleteDependencyCronJob(subscribeId);
  }

  subscribeDependencyCheck(subscribeId: string, mails: string[], url: string) {
    /* Every Day */
    const date = new Date();
    const cronTime = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} * * *`;

    this.cronjobService.addDependencyCronJob(
      subscribeId,
      mails,
      url,
      cronTime,
      this.dependencyCheckAndSendEmail.bind(this, subscribeId, mails, url),
    );
  }

  loadDependencyJobs() {
    const dependencyJobs = this.cronjobService.getDependecyJobs();

    for (let i = 0; i < dependencyJobs.length; i++) {
      const dependencyJob = dependencyJobs[i];

      this.subscribeDependencyCheck(
        dependencyJob.jobId,
        dependencyJob.mails,
        dependencyJob.url,
      );
    }
  }
}
