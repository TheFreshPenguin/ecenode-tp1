import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'

export class User {
  public username: string
  public email: string
  public password: string

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email
    this.password = password

    // if (!passwordHashed) {
    //   this.setPassword(password)
    // } else this.password = password
  }

  static fromDb(username: string, value: any): User {
      const [password, email] = value.split(":")
      return new User(username, email, password)
    }

    public setPassword(toSet: string): void {
      // Hash and set password
    }

    public getPassword(): string {
      return this.password
    }

    public validatePassword(toValidate: String): boolean {
      // return comparison with hashed password

      return(toValidate == this.password)
    }
  }

  export class UserHandler {
  public db: any

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      else callback(null, User.fromDb(username, data))
    })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    console.log(user.username)
    this.db.put(`user:${user.username}`, `${user.password}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    // TODO
  }

  constructor(path: string) {
    this.db = LevelDb.open(path)
  }
}
