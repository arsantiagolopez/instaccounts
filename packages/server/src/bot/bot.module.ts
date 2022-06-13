import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/auth/entities';
import { Instagram } from 'src/instagram/entities';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Instagram])],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
