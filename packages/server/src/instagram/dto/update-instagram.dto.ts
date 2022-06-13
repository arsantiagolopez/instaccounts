import { PartialType } from '@nestjs/swagger';
import { AddInstagramDto } from '.';

export class UpdateInstagramDto extends PartialType(AddInstagramDto) {}
