import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('ScanPoint', () => {
  it('should create a scan point with coordinates, enemies and allies', () => {
    const coordinates = new Coordinates(1, 1);
    const enemies = new Enemy(EnemyType.SOLDIER, 1);
    const allies = 2;

    const scanPoint = new ScanPoint(coordinates, enemies, allies);

    expect(scanPoint.coordinates).toBe(coordinates);
    expect(scanPoint.enemies).toBe(enemies);
    expect(scanPoint.allies).toBe(allies);
    expect(scanPoint.valid).toBe(true);
  });

  it('should create a scan point without allies', () => {
    const coordinates = new Coordinates(1, 1);
    const enemies = new Enemy(EnemyType.SOLDIER, 1);

    const scanPoint = new ScanPoint(coordinates, enemies);

    expect(scanPoint.coordinates).toBe(coordinates);
    expect(scanPoint.enemies).toBe(enemies);
    expect(scanPoint.allies).toBeUndefined();
    expect(scanPoint.valid).toBe(true);
  });

  it('should calculate distance to origin', () => {
    const scanPoint = new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1));

    expect(scanPoint.getDistanceToOrigin()).toBe(5);
  });

  it('should mark point as invalid if distance to origin is greater than 100', () => {
    const scanPoint = new ScanPoint(new Coordinates(80, 80), new Enemy(EnemyType.MECH, 1));

    expect(scanPoint.valid).toBe(false);
  });

  it('should mark point as valid if distance to origin is less than or equal to 100', () => {
    const scanPoint = new ScanPoint(new Coordinates(60, 60), new Enemy(EnemyType.SOLDIER, 1));

    expect(scanPoint.valid).toBe(true);
  });
});
