import { IsNotEmpty, IsObject, IsString } from 'class-validator';

class TranscoderWebhookDetail {
  @IsString()
  @IsNotEmpty()
  originalKey: string;

  @IsString()
  @IsNotEmpty()
  hlsUrl: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

export class VideoWebhookDto {
  @IsString()
  @IsNotEmpty()
  'detail-type': string;

  @IsObject()
  @IsNotEmpty()
  detail: TranscoderWebhookDetail;
}
