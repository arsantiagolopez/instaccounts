import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Instagram } from 'src/instagram/entities';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Post } from './entities';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getAllUsersPosts(username: string): Promise<Post[]> {
    const posts = await this.postRepository.find({ where: { username } });
    return posts.reverse();
  }

  async updatePostsWithLocalData(
    instagram: Instagram,
    dir: string,
    username: string,
  ): Promise<void> {
    const files = fs.readdirSync(dir);
    const postsFilenames = files.filter(
      (str) => str.includes('.json') && !str.includes(username),
    );

    const posts: Post[] = postsFilenames?.map((filename) => {
      let isCarousel: boolean = false;
      let carouselImages: string[] | undefined;
      const dataPath = dir + filename;
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      const {
        dimensions: { height, width },
        location,
        edge_media_to_comment: { count: comments },
        edge_media_preview_like: { count: likes },
        taken_at_timestamp,
        edge_sidecar_to_children,
      } = data.node;

      // Caption: Captions could be null
      const captionFilename = filename.replace('.json', '.txt');
      const captionPath = dir + captionFilename;
      let caption: string | undefined;

      if (fs.existsSync(captionPath)) {
        const content = fs.readFileSync(captionPath, 'utf8');
        caption = content.toString();
      }

      // Image: Posts could be carousels
      let imageFilename = filename.replace('.json', '.jpg');
      let image = `/accounts/${username}/${imageFilename}`;

      if (edge_sidecar_to_children) {
        imageFilename = filename.replace('.json', '');

        isCarousel = true;
        carouselImages = files
          .filter((str) => str.includes(imageFilename) && str.includes('.jpg'))
          .map((str) => `/accounts/${username}/${str}`);
        // Make first image the cover image
        image = image.replace('.jpg', '_1.jpg');
      }

      // Date: Convert from UNIX to Date()
      const timestamp = new Date(taken_at_timestamp * 1000);

      return {
        id: v4(),
        username,
        height,
        width,
        image,
        caption,
        location: location?.name ?? null,
        comments,
        likes,
        timestamp,
        isCarousel,
        carouselImages,
        instagramId: instagram.id,
        instagram,
      };
    });

    // Upsert posts to db
    await this.postRepository.upsert(posts, ['id']);
  }
}
