import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddAppDto {
  // Name
  @ApiProperty({
    example: 'Instagram Feed',
    description: 'Name of the app',
    format: 'string',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  // Description
  @ApiProperty({
    example: `Display all your accounts's posts.`,
    description: 'The description of the app',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description!: string;

  // Image
  @ApiProperty({
    example:
      'https://www.citypng.com/public/uploads/preview/-11590310104ndbzw5figp.png',
    description: "Image URL for the app's icon",
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  image!: string;
}
