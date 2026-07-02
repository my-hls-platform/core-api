import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

class AwsWebhookDetail {
  @IsString()
  @IsOptional()
  originalKey?: string;

  @IsString()
  @IsOptional()
  hlsUrl?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class VideoWebhookDto {
  @IsString()
  @IsNotEmpty()
  'detail-type': string;

  @IsObject()
  @IsNotEmpty()
  detail: AwsWebhookDetail;
}
