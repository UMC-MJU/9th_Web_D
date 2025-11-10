import { PartialType } from '@nestjs/swagger';

import { CreateLpsDto } from 'src/lps/dto/create-lps.dto';

export class UpdateLpsDto extends PartialType(CreateLpsDto) {}
