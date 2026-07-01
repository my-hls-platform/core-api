import { PartialType } from '@nestjs/mapped-types';
import { VideoStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus;

  @IsOptional()
  @IsString()
  rawUrl?: string;

  @IsOptional()
  @IsString()
  hslUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
