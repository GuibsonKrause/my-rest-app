import { Injectable, Module } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitRpcParamsFactory,
} from '@golevelup/nestjs-rabbitmq';

@Module({
  providers: [RabbitMQService, AmqpConnection, RabbitRpcParamsFactory],
  exports: [RabbitMQService, AmqpConnection],
})
@Injectable()
export class RabbitMQService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendUserCreatedEvent(data: any): Promise<void> {
    await this.amqpConnection.publish(
      'user-exchange', // Exchange name
      'user.created', // Routing key
      data, // Message payload
    );
  }
}
