/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand, CronJob } from 'cron';
import { writeFileSync, readFileSync } from 'fs';
import { DependecyCronJob } from './cronjob.interface';
import { resolve } from 'path';

@Injectable()
export class CronjobService {
  private dataJobsPath = resolve(__dirname, './cronjob.data.json');

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addDependencyCronJob(
    jobId: string,
    mails: string[],
    url: string,
    fn: CronCommand,
  ): void {
    const date = new Date();
    // const cronTime = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} * * *`;
    const cronTime = `*/30 * * * * *`;

    const job = new CronJob(cronTime, fn);

    const dependencyCronJobs: DependecyCronJob[] = this.getDependecyJobs();

    if (!dependencyCronJobs.find((c) => c.jobId === jobId)) {
      dependencyCronJobs.push({
        jobId,
        mails,
        url,
      } as DependecyCronJob);

      this.setDependencyJobs(dependencyCronJobs);
    }

    this.schedulerRegistry.addCronJob(jobId, job);
    job.start();
  }

  /**
   * @desc
   * IF Cronjob exists Delete and return true\
   * IF Cronjob not exists return false
   */
  deleteDependencyCronJob(jobId: string): boolean {
    const dependencyCronJobs: DependecyCronJob[] = this.getDependecyJobs();

    const newDependencyCronJobs = dependencyCronJobs.filter(
      (c) => c.jobId !== jobId,
    );

    if (newDependencyCronJobs.length === dependencyCronJobs.length)
      return false;

    this.setDependencyJobs(newDependencyCronJobs);
    this.schedulerRegistry.deleteCronJob(jobId);

    return true;
  }

  private setDependencyJobs(dependecyCronJobs: DependecyCronJob[]): void {
    writeFileSync(this.dataJobsPath, JSON.stringify(dependecyCronJobs), {
      encoding: 'utf-8',
    });
  }

  getDependecyJobs(): DependecyCronJob[] {
    const dependencyCronJobs: DependecyCronJob[] = JSON.parse(
      readFileSync(this.dataJobsPath, { encoding: 'utf-8' }),
    );

    return dependencyCronJobs;
  }
}
