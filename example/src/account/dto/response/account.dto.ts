import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  balance: number;

  constructor(_id: string, title: string, balance: number) {
    this._id = _id;
    this.title = title;
    this.balance = balance;
  }
}
