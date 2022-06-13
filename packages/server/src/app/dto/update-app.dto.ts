import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAppDto {
  // isActive
  @ApiProperty({
    example:
      'https://www.citypng.com/public/uploads/preview/-11590310104ndbzw5figp.png',
    description: 'Enabled/disabled state of app.',
    format: 'boolean',
  })
  @IsBoolean()
  isActive!: boolean;
}
