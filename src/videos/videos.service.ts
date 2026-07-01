import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        status: 'PENDING',
      },
    });
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
