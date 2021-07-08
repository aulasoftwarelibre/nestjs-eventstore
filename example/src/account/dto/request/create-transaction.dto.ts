import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ required: false })
  _id: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @IsNotEmpty()
  date: Date;

  constructor(_id: string, value: number, date: Date) {
    this._id = _id;
    this.value = value;
    this.date = date;
  }
}
