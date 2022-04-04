import {
  IsBoolean,
  IsEmail,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { OutdatedDependecy } from './app.interface';

export class DependencyCheckRequestDTO {
  @IsEmail({}, { each: true })
  @ValidateIf((object) => object.subscribe)
  mails?: string[];

  @IsString()
  url: string;

  @IsBoolean()
  subscribe: boolean;
}

export class DependencyCheckResponseDTO {
  subscribeId: string | null;
  outdatedDependecyList: OutdatedDependecy[];
}

export class UnSubsribeDependencyCheckRequestDTO {
  @IsString()
  @MinLength(6)
  subscribeId: string;
}

export class DependencyCheckUnsubscribeResponseDTO {
  status: boolean;
}
