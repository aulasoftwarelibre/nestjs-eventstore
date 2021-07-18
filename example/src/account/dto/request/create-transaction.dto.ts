import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ required: false })
  _id: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsNotEmpty()
  @Min(1)
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

export function isCreateTransactionDto(arg: any): arg is CreateTransactionDto {
  return arg && arg._id && arg.value && arg.date;
}
