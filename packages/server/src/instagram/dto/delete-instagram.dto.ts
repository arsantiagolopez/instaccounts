import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteInstagramDto {
  // Username
  @ApiProperty({
    example: 'markzuckerberg',
    description: 'The username of user to delete',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  username!: string;
}
