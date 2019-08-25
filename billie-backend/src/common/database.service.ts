import { Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { MongoClient, Db, Collection } from 'mongodb';

const url = 'mongodb://localhost:27017/';
const dbName = 'billie';

@Injectable()
export class DatabaseService {
  execute(action: (db: Db) => void) {
    MongoClient.connect(url, (err, client) => {
      assert.strictEqual(null, err);
      action(client.db(dbName));
      client.close();
    });
  }

  executeOnCollection(collectionName: string, action: (collection: Collection) => void) {
    this.execute(db => action(db.collection(collectionName)));
  }

  connect(): Promise<MongoClient> {
    return new Promise<MongoClient>((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) {
          reject(err);
        } else {
          resolve(client);
        }
      });
    });
  }
}
