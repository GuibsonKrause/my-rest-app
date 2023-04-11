import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: any;
  
    const mockUserModel = {
      save: jest.fn(),
      findOne: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
      findOneAndUpdate: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    };
  
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UsersService,
            {
              provide: getModelToken(User.name),
              useValue: {
                new: () => jest.fn(),
                constructor: jest.fn(),
                findById: jest.fn(),
                findOne: jest.fn(),
                findOneAndUpdate: jest.fn(),
                deleteOne: jest.fn(),
                save: jest.fn(),
              },
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
  
        const mockSave = jest.fn().mockResolvedValue(user);
        mockUserModel.save = mockSave;
  
        const result = await service.createUser(user);
        expect(result).toEqual(user);
        expect(mockSave).toHaveBeenCalled();
      });
    });

    describe('findByUserId', () => {
        it('should find a user by id and return it', async () => {
          const user: Partial<User> = {
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth',
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
          };
      
          const mockFindOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
          mockUserModel.findOne = mockFindOne;
      
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
          mockUserModel.findOneAndUpdate = mockFindOneAndUpdate;
      
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
      mockUserModel.findOneAndUpdate.mockReturnValue(updatedUser);
  
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
