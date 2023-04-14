import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Res,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import axios from 'axios';
import { Response } from 'express';
import { RabbitMQService } from './rabbitmq.service';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Post('/users')
  async createUser(@Body() user: Partial<User>): Promise<User> {
    const createdUser = await this.usersService.createUser(user);

    await this.sendDummyEmail(createdUser.email);
    await this.rabbitMQService.sendUserCreatedEvent(createdUser);

    return createdUser;
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId: number): Promise<any> {
    try {
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
      return response.data.data;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get('/user/:userId/avatar')
  async getAvatar(
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.usersService.findByUserId(userId);

    if (user && user.avatar) {
      res.setHeader('Content-Type', 'image/jpeg');
      return res.send(Buffer.from(user.avatar, 'base64'));
    } else {
      try {
        const response = await axios.get(
          `https://reqres.in/api/users/${userId}`,
        );
        const avatarUrl = response.data.data.avatar;

        const imageResponse = await axios.get(avatarUrl, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        await this.usersService.updateUserAvatar(
          userId,
          imageBuffer.toString('base64'),
          'some-hash',
        );

        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(imageBuffer);
      } catch (error) {
        throw new NotFoundException('Avatar not found');
      }
    }
  }

  @Delete('/user/:userId/avatar')
  async deleteAvatar(@Param('userId') userId: number): Promise<any> {
    const user = await this.usersService.findByUserId(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.usersService.deleteUserAvatar(userId);

    return { message: 'Avatar deleted successfully' };
  }

  private async sendDummyEmail(email: string): Promise<void> {
    try {
      console.log(`[Dummy Email] Sending email to: ${email}`);
      // Simulate a delay in sending the email (e.g., 2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`[Dummy Email] Email sent to: ${email}`);
    } catch (error) {
      console.error(`[Dummy Email] Error sending email to: ${email}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to send the dummy email',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
