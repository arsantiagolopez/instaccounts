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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards';
import { RequestWithUserId } from 'src/common/interfaces';
import { BotService } from './bot.service';
import { RunScriptDto } from './dto';
import { UpdatePreferencesDto } from './dto/updatePreferencesDto';
import { Preferences } from './entities';

@Controller('bots')
@ApiTags('Bots')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('run')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async runScript(
    @Req() req: RequestWithUserId,
    @Body() runScriptDto: RunScriptDto,
  ): Promise<void> {
    // Authorize user
    await this.botService.authenticate(req, runScriptDto);

    // Can run script
    return this.botService.runScript(runScriptDto);
  }

  @Post('stop')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async stopScript(): Promise<void> {
    return this.botService.stopScript();
  }

  @Get('preferences/:username')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getPreferences(
    @Req() req: RequestWithUserId,
    @Param('username') username: string,
  ): Promise<Partial<Preferences>> {
    return this.botService.getPreferences(req, username);
  }

  @Put('preferences')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Req() req: RequestWithUserId,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ): Promise<Partial<Preferences>> {
    return this.botService.updatePreferences(req, updatePreferencesDto);
  }

  @Post('test')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async test(@Body() preferences: Partial<Preferences>): Promise<void> {
    return this.botService.updateQuickstartFile(preferences);
  }
}
