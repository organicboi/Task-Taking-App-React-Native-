// model/Post.js
import {Model} from '@nozbe/watermelondb';
import {field, readonly, date} from '@nozbe/watermelondb/decorators';

export default class TaskModel extends Model {
  static table = 'tasks';
  @field('title') title;
  @field('desc') desc;
  @field('priority') priority;
  @readonly @date('created_at') created_at;
}
