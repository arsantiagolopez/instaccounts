import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { RequestWithUserId } from 'src/common/interfaces';
import { Instagram } from 'src/instagram/entities';
import { Repository } from 'typeorm';
import { RunScriptDto } from './dto';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Instagram)
    private instagramRepository: Repository<Instagram>,
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
      throw new HttpException(
        `Password doesn't match our records. Try again.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async runScript(runScriptDto: RunScriptDto) {
    const { username, password } = runScriptDto;

    // Working, @todo:
    // 1. Alter quickstart.py files to custom params
    // 2. Show logs on /bot screen
    // 3. Start/Stop buttons

    const script: ChildProcessWithoutNullStreams = spawn(
      'source env/bin/activate && python quickstart.py',
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

    // Logs
    script.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    // Errors
    script.on('error', (err) => {
      console.log(err);
    });

    // Exit
    script.on('exit', (exitCode) => {
      console.log('Script ended with code: ' + exitCode);
    });
  }
}
