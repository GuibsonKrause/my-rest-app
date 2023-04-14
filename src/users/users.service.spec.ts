import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: any;

    const createMockUserModel = (user: Partial<User>) => ({
      ...mockUserModel,
      ...user,
      save: jest.fn().mockResolvedValue(user),
    });
  
    const mockUserModel = {
      new: jest.fn().mockImplementation((user: Partial<User>) => {
        return {
          ...user,
          save: jest.fn().mockResolvedValue({ ...user }),
        };
      }),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getModelToken(User.name),
            useValue: mockUserModel,
          },
        ],
      }).compile();
    
      service = module.get<UsersService>(UsersService);
      userModel = module.get<typeof User>(getModelToken(User.name));
    });
    
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    describe('createUser', () => {
      it('should create a user and return it', async () => {
        const user: Partial<User> = {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          avatar: null,
          hash: 'testhash',
        };
    
        const newUser = {
          ...user,
          save: jest.fn().mockResolvedValue(user),
        };
        userModel.new.mockReturnValue(newUser);
    
        const result = await service.createUser(user);
        expect(result).toEqual(user);
        expect(userModel.new).toHaveBeenCalledWith(user);
      });
    });

    describe('findByUserId', () => {
        it('should find a user by id and return it', async () => {
          const user: Partial<User> = {
            id: 1,
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            avatar: 'updated-avatar-url',
          };
      
          const mockFindOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
          userModel.findOne = mockFindOne;
      
          const result = await service.findByUserId(1);
          expect(result).toEqual(user);
          expect(mockFindOne).toHaveBeenCalledWith({ id: 1 });
        });
      });
      
      describe('updateUserAvatar', () => {
        it('should update the user avatar and return the updated user', async () => {
          const user: Partial<User> = {
            id: 1,
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            avatar: 'updated-avatar-url',
            hash: 'testhash',
          };
      
          const mockFindOneAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
          userModel.findOneAndUpdate = mockFindOneAndUpdate;
      
          const result = await service.updateUserAvatar(1, 'updated-avatar-url', 'testhash');
          expect(result).toEqual(user);
          expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ id: 1 }, { avatar: 'updated-avatar-url', hash: 'testhash' }, { new: true });
        });
      });

  describe('deleteUserAvatar', () => {
    it('should delete the user avatar and return the updated user', async () => {
      const userId = 1;
      const user: Partial<User> = {
        id: userId,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar: 'avatar-base64-string',
        hash: 'avatar-hash',
      };
      const updatedUser: Partial<User> = {
        ...user,
        avatar: null,
        hash: null,
      };
      userModel.findOneAndUpdate.mockReturnValue(updatedUser);
  
      const result = await service.deleteUserAvatar(userId);
      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: userId },
        { avatar: null, hash: null },
        { new: true },
      );
    });
  });
})  
