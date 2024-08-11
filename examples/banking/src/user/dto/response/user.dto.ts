import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

interface Props {
  _id: string
  password: string
  username: string
}

export class UserDto {
  @ApiProperty()
  public readonly _id: string

  @ApiProperty()
  public readonly username: string

  @Exclude()
  public readonly password: string

  constructor(props: Props) {
    this._id = props._id
    this.username = props.username
    this.password = props.password
  }
}
