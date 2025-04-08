import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('Enemy', () => {
  it('should create an enemy with type and number', () => {
    const enemy = new Enemy(EnemyType.SOLDIER, 1);
    expect(enemy.type).toBe(EnemyType.SOLDIER);
    expect(enemy.number).toBe(1);
  });

  it('should create a mech enemy', () => {
    const enemy = new Enemy(EnemyType.MECH, 2);
    expect(enemy.type).toBe(EnemyType.MECH);
    expect(enemy.number).toBe(2);
  });

  it('should handle different number values', () => {
    const lowNumber = new Enemy(EnemyType.SOLDIER, 1);
    const highNumber = new Enemy(EnemyType.SOLDIER, 5);

    expect(lowNumber.number).toBeLessThan(highNumber.number);
  });

  it('should allow same type with different numbers', () => {
    const enemy1 = new Enemy(EnemyType.MECH, 1);
    const enemy2 = new Enemy(EnemyType.MECH, 2);

    expect(enemy1.type).toBe(enemy2.type);
    expect(enemy1.number).not.toBe(enemy2.number);
  });
});
