import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithUserId } from 'src/common/interfaces';
import { Repository } from 'typeorm';
import { AddAppDto, UpdateAppDto } from './dto';
import { App } from './entities';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App)
    private appRepository: Repository<App>,
  ) {}

  async addOne(addAppDto: AddAppDto, req: RequestWithUserId): Promise<App> {
    const { userId } = req;
    const app = this.appRepository.create({ ...addAppDto, userId });
    return this.appRepository.save(app);
  }

  async findAll(req: RequestWithUserId): Promise<App[]> {
    const { userId } = req;
    return await this.appRepository.find({ where: { userId } });
  }

  async updateOne(
    id: string,
    updateAppDto: UpdateAppDto,
    req: RequestWithUserId,
  ): Promise<App> {
    const { userId } = req;
    return await this.appRepository.save({ id, userId, ...updateAppDto });
  }
}
