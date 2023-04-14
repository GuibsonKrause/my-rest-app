import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = new (this.userModel as any)(user);
    const createdUser = await newUser.save();
    return createdUser;
  }    
  
  async findByUserId(userId: number): Promise<User | null> {
    return this.userModel.findOne({ id: userId }).exec();
  }

  async updateUserAvatar(
    userId: number,
    avatar: string,
    hash: string,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ id: userId }, { avatar, hash }, { new: true })
      .exec();
  }

  async deleteUserAvatar(userId: number): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { id: userId },
        { avatar: null, hash: null },
        { new: true },
      )
      .exec();
  }
}
