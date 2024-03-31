// model/schema.js
import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'desc', type: 'string', isOptional: true},
        {name: 'priority', type: 'string'},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
