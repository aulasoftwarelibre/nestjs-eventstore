import { EncryptedAggregateRoot } from '@aulasoftwarelibre/nestjs-eventstore'

import { UserWasCreated } from '../event'
import { PasswordWasUpdated } from '../event/password-was-updated.event'
import { UserWasDeleted } from '../event/user-was-deleted.event'
import { Password } from './password'
import { UserId } from './user-id'
import { Username } from './username'

export class User extends EncryptedAggregateRoot {
  private _userId: UserId
  private _username: Username
  private _password: Password
  private _deleted: boolean

  public static add(
    userId: UserId,
    username: Username,
    password: Password,
  ): User {
    const user = new User()

    user.apply(new UserWasCreated(userId.value, username.value, password.value))

    return user
  }

  public aggregateId(): string {
    return this.id.value
  }

  get id(): UserId {
    return this._userId
  }

  get username(): Username {
    return this._username
  }

  get password(): Password {
    return this._password
  }

  get deleted(): boolean {
    return this._deleted
  }

  updatePassword(newPassword: Password): void {
    if (this._password.equals(newPassword)) {
      return
    }

    this.apply(new PasswordWasUpdated(this.id.value, newPassword.value))
  }

  delete() {
    if (this._deleted) {
      return
    }

    this.apply(new UserWasDeleted(this.id.value))
  }

  private onUserWasCreated(event: UserWasCreated) {
    this._userId = UserId.with(event.id)
    this._username = Username.with(event.username)
    this._password = Password.with(event.password)
    this._deleted = false
  }

  private onPasswordWasUpdated(event: PasswordWasUpdated) {
    this._password = Password.with(event.password)
  }

  private onUserWasDeleted() {
    this._deleted = true
  }
}
