import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { RequestWithUserId } from 'src/common/interfaces';
import { Instagram } from 'src/instagram/entities';
import { Repository } from 'typeorm';
import { BotGateway } from './bot.gateway';
import { RunScriptDto } from './dto';
import { UpdatePreferencesDto } from './dto/updatePreferencesDto';
import { Preferences } from './entities';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Instagram)
    private instagramRepository: Repository<Instagram>,
    @InjectRepository(Preferences)
    private preferencesRepository: Repository<Preferences>,
    private botGateway: BotGateway,
  ) {}

  async authenticate(req: RequestWithUserId, runScriptDto: RunScriptDto) {
    const { userId } = req;
    const { username, password } = runScriptDto;

    const instagram = await this.instagramRepository.findOne({
      where: {
        userId,
        username,
      },
    });

    if (!instagram) {
      throw new HttpException(
        `Instagram account doesn't exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid = await argon2.verify(instagram.password, password);

    if (!isValid) {
      // Log authentication error on client
      this.botGateway.handleLog('Bot paused – Authentication failed. ❌');

      throw new HttpException(
        `Password doesn't match our records. Try again.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Log success authentication on client
    this.botGateway.handleLog('Bot starting – Authentication successful! ✔');
  }

  async runScript(runScriptDto: RunScriptDto) {
    const { username, password } = runScriptDto;

    // Working, @todo:
    // 1. Alter quickstart.py files to custom params
    // 2. Show logs on /bot screen
    // 3. Start/Stop buttons

    const script: ChildProcessWithoutNullStreams = spawn(
      'source env/bin/activate && python3 quickstart.py',
      [
        `--username ${username}`,
        `--password ${password}`,
        '--headless-browser',
      ],
      {
        cwd: `${__dirname}/../../instapy`,
        shell: true,
      },
    );

    // Encode to string
    script.stdout.setEncoding('utf8');

    // Logs
    script.stdout.on('data', (data) => {
      const log = data.toString();
      this.botGateway.handleLog(log);
    });

    // Errors
    script.stderr.on('data', (data) => {
      const error = data.toString();
      this.botGateway.handleLog(error);
    });

    // Exit
    script.on('exit', (exitCode) => {
      // Log authentication error on client
      this.botGateway.handleLog(
        `Bot paused – Script exited with code ${exitCode}. ❌`,
      );
      console.log('Script ended with code: ' + exitCode);
    });
  }

  async stopScript(): Promise<void> {
    // Log authentication error on client
    this.botGateway.handleLog('Bot successfully stopped. ✔');
  }

  async getPreferences(
    req: RequestWithUserId,
    username: string,
  ): Promise<Partial<Preferences>> {
    const { userId } = req;

    const instagram = await this.instagramRepository.findOne({
      where: {
        userId,
        username,
      },
      relations: ['preferences'],
    });

    if (!instagram) {
      throw new HttpException(
        `Instagram could not be found.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id: _, username: __, ...preferences } = instagram.preferences;

    return preferences;
  }

  async updatePreferences(
    req: RequestWithUserId,
    updatePreferencesDto: UpdatePreferencesDto,
  ): Promise<Partial<Preferences>> {
    const { userId } = req;
    const { username } = updatePreferencesDto;

    // Only allow owners of instagram to update preferences
    const instagram = await this.instagramRepository.findOne({
      where: { userId, username },
    });

    if (!instagram) {
      throw new HttpException(
        `You can't update someone else's instagram preferences.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const preferences = await this.preferencesRepository.findOne({
      where: { username },
    });

    // Update entity fields with Dto
    const updated = {
      ...preferences,
      ...(updatePreferencesDto as unknown as Preferences),
    };

    const {
      id: _,
      username: __,
      ...publicPreferences
    } = await this.preferencesRepository.save(updated);

    // Update InstaPy quickstart.py file with new values
    await this.updateQuickstartFile(publicPreferences);

    return publicPreferences;
  }

  // Update local server/instapy/quickstart.py file
  async updateQuickstartFile(preferences: Partial<Preferences>): Promise<void> {
    const { hashtags, competitors, locations } = preferences;

    // quictart.py file
    const file = path.join(__dirname, '../../instapy/quickstart.py');

    // Get text value of quickstart.py file
    fs.readFile(file, 'utf-8', (_, data) => {
      let text = data;

      const hashtagsStr = 'hashtags = \\[';
      const competitorsStr = 'competitors = \\[';
      const locationsStr = 'locations = \\[';

      // Replace hashtags line with new values
      if (hashtags && typeof hashtags === 'object') {
        const re = new RegExp('(' + hashtagsStr + '.+)', 'g');
        const hashtagsNewLine =
          'hashtags = [' +
          (hashtags as string[]).map((i) => `'${i}'`).join(', ') +
          ']';
        text = text.replace(re, hashtagsNewLine);
      }

      // Replace competitors line with new values
      if (competitors && typeof competitors === 'object') {
        const re = new RegExp('(' + competitorsStr + '.+)', 'g');
        const competitorsNewLine =
          'competitors = [' +
          (competitors as string[]).map((i) => `'${i}'`).join(', ') +
          ']';
        text = text.replace(re, competitorsNewLine);
      }

      // Replace locations line with new values
      if (locations && typeof locations === 'object') {
        const re = new RegExp('(' + locationsStr + '.+)', 'g');
        const locationsNewLine =
          'locations = [' +
          (locations as string[]).map((i) => `'${i}'`).join(', ') +
          ']';
        text = text.replace(re, locationsNewLine);
      }

      // Save file with updated values
      fs.writeFileSync(file, text);
    });
  }
}
