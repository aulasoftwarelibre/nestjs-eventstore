import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  public readonly username: string;

  @ApiProperty({ required: false })
  public readonly password: string;
}
