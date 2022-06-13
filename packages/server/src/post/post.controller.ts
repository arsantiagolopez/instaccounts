import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards';
import { Post } from './entities';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':username')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'All posts fetched.' })
  @ApiBadRequestResponse({ description: 'User posts could not be fetched.' })
  getAllUsersPosts(@Param('username') username: string): Promise<Post[]> {
    return this.postService.getAllUsersPosts(username);
  }
}
