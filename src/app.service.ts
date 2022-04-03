import { Injectable } from '@nestjs/common';
import {
  Dependency,
  DependencyList,
  EDependencyType,
  IComposerJson,
  INPMPackageJson,
  OutdatedDependecy,
} from './app.interface';
import { versionCompare, versionFormater } from './common/utils';
import { CronjobService } from './cronjob/cronjob.service';
import { GithubApiService } from './github.api/github.api.service';
import { MailService } from './mail/mail.service';
import { FactoryVersionPickerService } from './version-picker/version-picker.service';

@Injectable()
export class AppService {
  constructor(
    private githubApiService: GithubApiService,
    private versionPicker: FactoryVersionPickerService,
    private cronjobService: CronjobService,
    private mailService: MailService,
  ) {
    this.loadDependencyJobs();
  }

  private async getOutdatedDependecyList(
    url: string,
  ): Promise<OutdatedDependecy[]> {
    const outDatedDependecyList: OutdatedDependecy[] = [];

    const dependencyList: DependencyList = await this.getRepoDependecy(url);

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

  private async getRepoDependecy(url: string): Promise<DependencyList> {
    const dependencyList: DependencyList = [];

    const [repo, owner] = url
      .trim()
      .replace(/\.git$/, '')
      .split('/')
      .reverse();

    const composerPackageJson: IComposerJson = JSON.parse(
      await this.githubApiService.getContent(owner, repo, 'composer.json'),
    );

    if (composerPackageJson) {
      const composerPackages = composerPackageJson.require;

      const composerMappedPackages: DependencyList = Object.keys(
        composerPackages,
      ).map((p) => {
        return {
          type: EDependencyType.composer,
          packageName: p,
          version: composerPackages[p],
        } as Dependency;
      });

      dependencyList.push(...composerMappedPackages);
    }

    const npmPackageJson: INPMPackageJson = JSON.parse(
      await this.githubApiService.getContent(owner, repo, 'package.json'),
    );

    if (npmPackageJson) {
      const npmPackages = npmPackageJson.dependencies;

      const npmMappedPackages: DependencyList = Object.keys(npmPackages).map(
        (p) => {
          return {
            type: EDependencyType.npm,
            packageName: p,
            version: npmPackages[p],
          } as Dependency;
        },
      );

      dependencyList.push(...npmMappedPackages);
    }

    return dependencyList;
  }

  async dependencyCheckRun(
    subscribeId: string,
    mails: string[],
    url: string,
  ): Promise<OutdatedDependecy[]> {
    const outdatedDependecyList: OutdatedDependecy[] =
      await this.getOutdatedDependecyList(url);

    console.info('mail', {
      to: mails,
      subject: `${url} Dependecy Check ${
        subscribeId ? 'SubscribeId: ' + subscribeId : ''
      }`,
      text: `${url} outdated dependency list:`,
      html: JSON.stringify(outdatedDependecyList, null, 2),
    });

    /* await this.mailService.send({
      to: mails,
      subject: `${url} Dependecy Check ${
        subscribeId ? 'SubscribeId: ' + subscribeId : ''
      }`,
      text: `${url} outdated dependency list:`,
      html: JSON.stringify(outdatedDependecyList, null, 2),
    }); */

    return outdatedDependecyList;
  }

  unsubscribeDependencyCheck(subscribeId: string): boolean {
    return this.cronjobService.deleteDependencyCronJob(subscribeId);
  }

  subscribeDependencyCheck(subscribeId: string, mails: string[], url: string) {
    this.cronjobService.addDependencyCronJob(
      subscribeId,
      mails,
      url,
      this.dependencyCheckRun.bind(this, subscribeId, mails, url),
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
