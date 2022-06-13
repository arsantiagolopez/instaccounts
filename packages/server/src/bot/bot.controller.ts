import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards';
import { RequestWithUserId } from 'src/common/interfaces';
import { BotService } from './bot.service';
import { RunScriptDto } from './dto';

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
  ) {
    // Authorize user
    await this.botService.authenticate(req, runScriptDto);

    // Can run script
    this.botService.runScript(runScriptDto);
  }
}
