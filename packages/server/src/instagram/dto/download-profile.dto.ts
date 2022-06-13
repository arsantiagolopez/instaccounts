import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DownloadProfileDto {
  // Username
  @ApiProperty({
    example: 'markzuckerberg',
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
}
