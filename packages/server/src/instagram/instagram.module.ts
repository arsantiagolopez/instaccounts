import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/auth/entities';
import { PostModule } from 'src/post/post.module';
import { Post } from '../post/entities';
import { Instagram } from './entities';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Instagram, Post]), PostModule],
  controllers: [InstagramController],
  providers: [InstagramService],
  exports: [InstagramService],
})
export class InstagramModule {}
