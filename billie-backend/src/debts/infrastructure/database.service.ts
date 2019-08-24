import { Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { MongoClient, Db } from 'mongodb';

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
}
