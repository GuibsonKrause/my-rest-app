import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { RabbitMQService } from './rabbitmq.service';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByUserId: jest.fn(),
            updateUserAvatar: jest.fn(),
            deleteUserAvatar: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            sendUserCreatedEvent: jest.fn(),
          },
        },
      ],
    }).compile();
  
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });
  


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const user: Partial<User> = {
        id: 1,
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
      };

      service.createUser = jest.fn().mockResolvedValue(user);

      const result = await controller.createUser(user);
      expect(result).toEqual(user);
      expect(service.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('findByUserId', () => {
    it('should find a user by id and return it', async () => {
      const user: Partial<User> = {
        id: 1,
        email: "george.bluth@reqres.in",
        first_name: "George",
        last_name: "Bluth",
        avatar: "https://reqres.in/img/faces/1-image.jpg",
      };

      service.findByUserId = jest.fn().mockResolvedValue(user);

      const result = await controller.getUser(1);
      expect(result).toEqual(user);
      expect(service.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete the user avatar and return the updated user', async () => {
      const userId = 1;
      const user: Partial<User> = {
        id: 1,
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };
      const updatedUser: Partial<User> = {
        ...user,
        avatar: null,
        hash: null,
      };

      service.deleteUserAvatar = jest.fn().mockResolvedValue(updatedUser);

      const result = await controller.deleteAvatar(userId);
      expect(result).toEqual(updatedUser);
      expect(service.deleteUserAvatar).toHaveBeenCalledWith(userId);
    });
  });
});
