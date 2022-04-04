import { Module } from '@nestjs/common';
import { GithubApiModule } from '../github.api/github.api.module';
import { DependencyCollectorService } from './dependency-collector.service';
import { DependencyCollectorComposerService } from './providers/dependency-collector.service.composer';
import { DependencyCollectorNPMService } from './providers/dependency-collector.service.npm';

@Module({
  imports: [GithubApiModule],
  providers: [
    DependencyCollectorService,
    DependencyCollectorComposerService,
    DependencyCollectorNPMService,
  ],
  exports: [DependencyCollectorService],
})
export class DependencyCollectorModule {}
