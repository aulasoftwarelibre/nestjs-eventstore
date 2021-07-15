import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  constructor(_id: string, title: string) {
    this._id = _id;
    this.title = title;
  }
}
