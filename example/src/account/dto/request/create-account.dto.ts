import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  constructor(_id: string, title: string) {
    this._id = _id;
    this.title = title;
  }
}
