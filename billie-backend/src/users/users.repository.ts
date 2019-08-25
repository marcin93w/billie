import { DatabaseService } from '../common/database.service';
import { Injectable } from '@nestjs/common';
import { User } from './user.type';
import { UserSchema } from '../common/database.schema';

@Injectable()
export class UsersRepository {
  private readonly collectionName = 'users';

  constructor(private readonly db: DatabaseService) {}

  async save(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.executeOnCollection(this.collectionName, collection => {
        collection.insertOne(user,
          error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
      });
    });
  }

  async find(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.db.executeOnCollection(this.collectionName, collection => {
        collection.findOne<UserSchema>({ id }, (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    });
  }
}
