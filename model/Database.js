/* eslint-disable prettier/prettier */
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {mySchema} from './schema';
import TaskModel from './TaskModel';

const adapter = new SQLiteAdapter({
  schema: mySchema,
});

export const database = new Database({
  adapter,
  modelClasses: [TaskModel],
  actionEnabled: true,
});
