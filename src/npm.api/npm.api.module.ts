import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NpmApiService } from './npm.api.service';

@Module({
  imports: [HttpModule],
  providers: [NpmApiService],
  exports: [NpmApiService],
})
export class NpmApiModule {}
