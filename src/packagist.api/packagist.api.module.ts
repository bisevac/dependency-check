import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PackagistApiService } from './packagist.api.service';

@Module({
  imports: [HttpModule],
  providers: [PackagistApiService],
  exports: [PackagistApiService],
})
export class PackagistApiModule {}
