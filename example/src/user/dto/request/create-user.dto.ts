import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(4)
  public readonly _id: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  public readonly password: string;
}
