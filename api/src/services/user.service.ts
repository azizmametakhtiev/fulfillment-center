import { User, UserDocument } from '../schemas/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { LoginDto } from '../dto/auth-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(userDto: CreateUserDto){
    const existingUser = await this.userModel.findOne({ email: userDto.email })
    if (existingUser) {
      throw new HttpException(`Пользователь с эл. почтой ${ userDto.email } уже зарегистрирован`, HttpStatus.CONFLICT)
    }
    const user = new this.userModel(userDto)
    return user.save()
  }

  async login(loginDto: LoginDto){
    const user = await this.userModel.findOne({ email: loginDto.email }).exec()
    if (!user) {
      throw new UnauthorizedException('Неверный email')
    }

    if (user.isArchived) {
      throw new ForbiddenException('Ваш аккаунт был деактивирован')
    }

    const isMatch = await user.checkPassword(loginDto.password)

    if (!isMatch) {
      throw new UnauthorizedException('Неверный пароль')
    }

    user.generateToken()
    await user.save()

    return user
  }

  async logout(id: string) {
    const user = await this.userModel.findById(id)

    if (!user) {
      throw new UnauthorizedException('Неверный email')
    }

    user.clearToken()
    await user.save()

    return { message: 'Вы вышли из системы.' }
  }

  async getAll() {
    const users = await this.userModel.find({ isArchived: false }).select('-token')
    return users.reverse()
  }

  async getArchivedUsers() {
    const users = await this.userModel.find({ isArchived: true }).select('-token')
    return users.reverse()
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id)

    if (!user) throw new NotFoundException('Пользователь не найден')

    if (user.isArchived) throw new ForbiddenException('Пользователь в архиве.')

    return user
  }

  async getArchivedById(id: string) {
    const user = await this.userModel.findById(id)

    if (!user) throw new NotFoundException('Пользователь не найден')

    if (!user.isArchived) throw new ForbiddenException('Этот пользователь не в архиве')

    return user
  }

  async update(id: string, userDto: UpdateUserDto) {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    if (userDto.email && userDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: userDto.email }).exec()

      if (existingUser && existingUser.id !== id) {
        throw new HttpException({
          type: 'ValidationError',
          errors: {
            email: {
              name: 'DtoValidationError',
              messages: [
                'Пользователь с такой электронной почтой уже существует',
              ],
            },
          },
        }, HttpStatus.BAD_REQUEST)
      }
    }

    Object.assign(user, userDto)
    user.generateToken()
    await user.save()
    return user
  }

  async archive(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isArchived: true })

    if (!user) throw new NotFoundException('Пользователь не найден')

    if (user.isArchived) throw new ForbiddenException('Пользователь уже в архиве')

    return { message: 'Пользователь перемещен в архив' }
  }

  async unarchive(id: string) {
    const user = await this.userModel.findById(id)

    if (!user) throw new NotFoundException('Пользователь не найден')

    if (!user.isArchived) throw new ForbiddenException('Пользователь не находится в архиве')

    user.isArchived = false
    await user.save()

    return { message: 'Пользователь восстановлен из архива' }
  }

  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }
    return { message: 'Пользователь успешно удалён' }
  }
}
