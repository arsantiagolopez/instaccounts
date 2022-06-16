import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as fs from 'fs';
import { Preferences } from 'src/bot/entities';
import { RequestWithUserId } from 'src/common/interfaces';
import { PublicInstagram } from 'src/common/interfaces/instagram';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { DownloadProfileDto } from './dto';
import { AddInstagramDto } from './dto/add-instagram.dto';
import { Instagram } from './entities';

@Injectable()
export class InstagramService {
  constructor(
    @InjectRepository(Instagram)
    private instagramRepository: Repository<Instagram>,
    @InjectRepository(Preferences)
    private preferencesRepository: Repository<Preferences>,
    // private botService: BotService,
    private postService: PostService,
  ) {}

  async addOne(
    addInstagramDto: AddInstagramDto,
    req: RequestWithUserId,
  ): Promise<PublicInstagram> {
    let { username, password } = addInstagramDto;
    const { userId } = req;
    username = username.toLowerCase();

    const instagramExists = await this.instagramRepository.findOne({
      where: {
        username,
      },
    });

    if (instagramExists) {
      throw new HttpException(
        'Instagram account already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password
    password = await argon2.hash(password);

    // Create preferences
    const preferences = this.preferencesRepository.create({
      hashtags: [] as unknown as string,
      competitors: [] as unknown as string,
      locations: [] as unknown as string,
      username,
    });

    await this.preferencesRepository.save(preferences);

    const instagram = this.instagramRepository.create({
      ...addInstagramDto,
      username,
      password,
      userId,
      preferences,
      lastActive: new Date(),
    });

    const {
      password: _,
      preferences: __,
      ...publicProfile
    } = await this.instagramRepository.save(instagram);

    return publicProfile;
  }

  async updateOne(
    username: string,
    data: Record<string, any>,
    req: RequestWithUserId,
  ): Promise<PublicInstagram> {
    const { userId } = req;

    const instagram = await this.instagramRepository.findOne({
      where: {
        username,
        userId,
      },
    });

    if (!instagram) {
      throw new HttpException(
        `Instagram @${username} doesn't exist.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let key in data) {
      (instagram as any)[key] = data[key];
    }

    return this.instagramRepository.save(instagram);
  }

  async deleteOne(
    username: string,
    req: RequestWithUserId,
  ): Promise<PublicInstagram> {
    const { userId } = req;
    const instagram = await this.instagramRepository.findOne({
      where: {
        userId,
        username,
      },
    });
    if (!instagram) {
      throw new HttpException(
        "Instagram account doesn't exist.",
        HttpStatus.BAD_REQUEST,
      );
    }

    // Remove downloaded local files
    const filesDir = `${__dirname}/../../../web/public/accounts/${username}/`;

    fs.rmSync(filesDir, { recursive: true });

    console.log(`${username}'s instagram contents deleted!`);

    // Remove document from database
    return await this.instagramRepository.remove(instagram);
  }

  async findAll(req: RequestWithUserId): Promise<PublicInstagram[]> {
    const { userId } = req;
    const instagrams = await this.instagramRepository.find({
      where: { userId },
    });

    // Return in order of creation (newest last)
    instagrams.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return instagrams;
  }

  async updateActive(
    id: string,
    req: RequestWithUserId,
  ): Promise<PublicInstagram> {
    const { userId } = req;
    const instagram = await this.instagramRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!instagram) {
      throw new HttpException(
        "Instagram account doesn't exist.",
        HttpStatus.BAD_REQUEST,
      );
    }

    instagram.lastActive = new Date();
    return await this.instagramRepository.save(instagram);
  }

  async authorize(
    addInstagramDto: AddInstagramDto,
    req: RequestWithUserId,
  ): Promise<PublicInstagram> {
    let { username, password } = addInstagramDto;

    let success = true;
    let instagram = null;

    // Create account folder if not exists
    const accountFolder = `${__dirname}/../../../web/public/accounts/${username}/`;

    if (!fs.existsSync(accountFolder)) {
      fs.mkdirSync(accountFolder);
    }

    // Attempt login
    const script: ChildProcessWithoutNullStreams = spawn(
      'source env/bin/activate && instaloader',
      [
        '--dirname-pattern=../../web/public/accounts/{profile}',
        `--login ${username}`,
        `--password ${password}`,
      ],
      {
        cwd: `${__dirname}/../../instaloader`,
        shell: true,
      },
    );

    // Logs & errors
    script.stderr.on('data', (data) => {
      const log = data.toString();
      if (log.includes('error')) {
        success = false;
      }
    });

    // Process exited
    script.on('error', (err) => {
      success = false;
    });

    await new Promise<void>((resolve) => {
      script.on('exit', () => {
        if (success) {
          console.log('Successful login!');
        } else {
          console.log('Login unsuccessful. Wrong credentials.');
        }
        resolve();
      });
    });

    // If logged in, authorize account. Else delete
    if (success) {
      const data = { isAuthorized: true };
      instagram = await this.updateOne(username, data, req);
    } else {
      await this.deleteOne(username, req);
      throw new HttpException(
        'Login unsuccessful. Wrong credentials.',
        HttpStatus.FORBIDDEN,
      );
    }

    return instagram;
  }

  async downloadProfile(
    downloadProfileDto: DownloadProfileDto,
    req: RequestWithUserId,
  ): Promise<PublicInstagram | void> {
    const { username } = downloadProfileDto;
    const { userId } = req;

    let success = true;

    // Guarantee only authorized profiles can be downloaded
    const instagram = await this.instagramRepository.findOne({
      where: {
        username,
        userId,
      },
    });

    if (!instagram?.isAuthorized) {
      throw new HttpException(
        "Instagram isn't authorized. Make sure you're logged in.",
        HttpStatus.FORBIDDEN,
      );
    }

    // Download profile
    const script: ChildProcessWithoutNullStreams = spawn(
      'source env/bin/activate && instaloader',
      [
        '--no-compress-json',
        '--no-videos',
        '--dirname-pattern=../../web/public/accounts/{profile}',
        `${username}`,
      ],
      {
        cwd: `${__dirname}/../../instaloader`,
        shell: true,
      },
    );

    // Logs & errors
    script.stderr.on('data', (data) => {
      const log = data.toString();
      if (log.includes('error')) {
        success = false;
      }
    });

    // Process exited
    script.on('error', (err) => {
      success = false;
    });

    await new Promise<void>((resolve) => {
      script.on('exit', () => {
        if (success) {
          console.log(`Profile for ${username} downloaded!`);
        } else {
          console.log('Profile could not be downloaded.');
        }
        resolve();
      });
    });

    // Update instagram entities with recently downloaded data
    return await this.updateEntitiesWithLocalData(instagram);
  }

  async updateEntitiesWithLocalData({
    username,
  }: {
    username: string;
  }): Promise<PublicInstagram | void> {
    const instagram = await this.instagramRepository.findOne({
      where: { username },
    });

    if (!instagram) {
      return console.log('******* ERROR: CANNOT FIND INSTAGRAM.');
    }

    // Get data folder path
    const dir = `${__dirname}/../../../web/public/accounts/${username}/`;

    // Check if data for profile exists
    if (!fs.existsSync(dir)) {
      throw new HttpException(
        `No local data found for @${username} instagram.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Data already downloaded, update database with downloaded data
    const profile = await this.updateProfileWithLocalData(
      instagram,
      dir,
      username,
    );
    await this.postService.updatePostsWithLocalData(instagram, dir, username);

    return profile;
  }

  async updateProfileWithLocalData(
    instagram: Instagram,
    dir: string,
    username: string,
  ): Promise<PublicInstagram> {
    const files = fs.readdirSync(dir);
    const dataFilename = files.find((str) => str.includes(username));
    const dataPath = dir + dataFilename;
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const {
      full_name: name,
      biography: bio,
      edge_followed_by: { count: followers },
      edge_follow: { count: following },
    } = data.node;

    const profilePictureFilename = files.find((str) =>
      str.includes('profile_pic'),
    );
    // Relative to /public/ path
    const image = `/accounts/${username}/${profilePictureFilename}`;

    interface PartialInstagram {
      [key: string]: string;
    }

    const fields: PartialInstagram = {
      image,
      name,
      bio,
      followers,
      following,
    };

    for (const key in fields) {
      (instagram as any)[key] = fields[key];
    }

    return await this.instagramRepository.save(instagram);
  }

  async test(): Promise<any> {
    let username = 'lifeingodmode';
    let success = true;

    // Download profile
    const script: ChildProcessWithoutNullStreams = spawn(
      'source env/bin/activate && instaloader',
      [
        '--no-compress-json',
        '--no-videos',
        '--dirname-pattern=../../web/public/accounts/{profile}',
        `${username}`,
      ],
      {
        cwd: `${__dirname}/../../instaloader`,
        shell: true,
      },
    );

    // Logs & errors
    script.stderr.on('data', (data) => {
      const log = data.toString();

      if (log.includes('error')) {
        success = false;
      }
    });

    // Process exited
    script.on('error', (err) => {
      success = false;
    });

    await new Promise<void>((resolve) => {
      script.on('exit', () => {
        if (success) {
          console.log(`Profile for ${username} downloaded!`);
        } else {
          console.log('Profile could not be downloaded.');
        }
        resolve();
      });
    });
    return;
  }
}
