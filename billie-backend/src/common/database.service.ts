import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';
import { DebtsLedgerSchema, UserSchema } from './database.schema';

const url = 'mongodb://localhost:27017/';
const dbName = 'billie';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;

  get users(): Collection<UserSchema> {
    return this.client.db(dbName).collection('users');
  }

  get debtsLedgers(): Collection<DebtsLedgerSchema> {
    return this.client.db(dbName).collection('debt-ledgers');
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) {
          reject(err);
        } else {
          this.client = client;
          resolve();
        }
      });
    });
  }

  close(): Promise<void> {
    return this.client.close();
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }
}
