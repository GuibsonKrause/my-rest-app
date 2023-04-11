import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodb: {
    url: 'mongodb://localhost:27017/my-rest-app',
  },
  rabbitmq: {
    host: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    queue: 'my-queue',
  },
};
