import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  private s3Client: S3Client;

  constructor(private readonly prisma: PrismaService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async create(createVideoDto: CreateVideoDto) {
    const video = await this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        status: 'PENDING',
      },
    });

    const uniqueFileName = `${video.id}-${createVideoDto.fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_RAW_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: createVideoDto.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return {
      video,
      uploadUrl,
      objectKey: uniqueFileName,
    };
  }

  async findAll() {
    return this.prisma.video.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video) throw new NotFoundException(`Video with id ${id} not found`);
    return video;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    await this.findOne(id);
    return this.prisma.video.update({
      where: { id },
      data: updateVideoDto,
    });
  }

  async remove(id: string) {
    const video = await this.findOne(id);
    if (!video) throw new NotFoundException(`Video with id ${id} not found`);
    return this.prisma.video.delete({
      where: { id },
    });
  }
}
