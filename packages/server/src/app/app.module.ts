import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Session } from 'src/auth/entities';
import { BotModule } from 'src/bot/bot.module';
import { InstagramModule } from 'src/instagram/instagram.module';
import { PostModule } from 'src/post/post.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { App } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Session, App]),
    InstagramModule,
    AuthModule,
    BotModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
