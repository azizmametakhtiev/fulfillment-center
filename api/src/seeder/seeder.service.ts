import { Injectable } from '@nestjs/common'
import { Connection, Model } from 'mongoose'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/schemas/user.schema'
import { randomUUID } from 'node:crypto'

@Injectable()
export class SeederService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async seed() {
    await this.connection.dropDatabase()

    await this.userModel.create(
      {
        email: 'azizmam65@gmail.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Admin',
        role: 'super-admin',
        token: randomUUID(),
        isArchived: false,
      }
    )
  }
}
