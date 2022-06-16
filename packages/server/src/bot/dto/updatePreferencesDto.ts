import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePreferencesDto {
  // Username
  @ApiProperty({
    example: 'leomessi',
    description: 'The username of the user',
    format: 'string',
    uniqueItems: true,
    minLength: 3,
    maxLength: 25,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  username!: string;

  // Hashtags
  @ApiProperty({
    example: 'love, play, game',
    description: 'Hashtags to interact with',
    format: 'array',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsArray()
  hashtags!: string[];

  // Competitors
  @ApiProperty({
    example: 'justinbieber, tombrady, leomessi',
    description: 'Users whose followers you want to interact with',
    format: 'array',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsArray()
  competitors!: string[];

  // Locations
  @ApiProperty({
    example: '1026319696/sxsw, 214688775/the-central-park-nyc, c2464828',
    description: 'Location codes to interact with',
    format: 'array',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsArray()
  locations!: string[];
}
