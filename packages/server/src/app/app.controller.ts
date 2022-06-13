import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards';
import { RequestWithUserId } from 'src/common/interfaces';
import { AppService } from './app.service';
import { AddAppDto, UpdateAppDto } from './dto';
import { App } from './entities';

@Controller()
@ApiTags('Apps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('apps')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'App was successfully added.' })
  async addOne(
    @Body() addAppDto: AddAppDto,
    @Req() req: RequestWithUserId,
  ): Promise<App> {
    return this.appService.addOne(addAppDto, req);
  }

  @Get('apps')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Apps successfully fetched.' })
  async findAll(@Req() req: RequestWithUserId): Promise<App[]> {
    return this.appService.findAll(req);
  }

  @Put('apps/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'App successfully updated.' })
  async updateOne(
    @Param('id') id: string,
    @Body() updateAppDto: UpdateAppDto,
    @Req() req: RequestWithUserId,
  ): Promise<App> {
    return this.appService.updateOne(id, updateAppDto, req);
  }
}
