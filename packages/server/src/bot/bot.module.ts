import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/auth/entities';
import { Instagram } from 'src/instagram/entities';
import { BotController } from './bot.controller';
import { BotGateway } from './bot.gateway';
import { BotService } from './bot.service';
import { Preferences } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Instagram, Preferences])],
  controllers: [BotController],
  providers: [BotService, BotGateway],
})
export class BotModule {}
