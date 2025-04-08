import { EnemyType } from '../enums';

export class Enemy {
  constructor(
    public readonly type: EnemyType,
    public readonly number: number,
  ) {}
}
