import { AvoidMechProtocol } from '@domain/strategies/protocols/avoid-mech.strategy';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('AvoidMechProtocol', () => {
  let protocol: AvoidMechProtocol;

  beforeEach(() => {
    protocol = new AvoidMechProtocol();
  });

  describe('apply', () => {
    it('should return empty array when scan points array is empty', () => {
      const result = protocol.apply([]);
      expect(result).toEqual([]);
    });

    it('should return array with only soldier enemies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 0),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[0].enemies.type).toBe(EnemyType.SOLDIER);
    });

    it('should return empty array when all points have mech enemies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.MECH, 1), 0),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 2), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toEqual([]);
    });

    it('should maintain original order of non-mech points', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 0),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 1), 0),
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(5, 5));
    });

    it('should ignore allies when filtering points', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 5),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[0].allies).toBe(5);
    });

    it('should ignore point validity when filtering', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(100, 100), new Enemy(EnemyType.SOLDIER, 1), 0), // Invalid due to distance
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(100, 100));
      expect(result[0].valid).toBe(false);
    });

    it('should handle single scan point with soldier enemy', () => {
      const scanPoints = [new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 0)];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(5, 5));
    });

    it('should handle single scan point with mech enemy', () => {
      const scanPoints = [new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.MECH, 1), 0)];

      const result = protocol.apply(scanPoints);
      expect(result).toEqual([]);
    });

    it('should work with multiple soldier and mech enemies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 0),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 2), 0),
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 3), 0),
        new ScanPoint(new Coordinates(7, 7), new Enemy(EnemyType.MECH, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(5, 5));
      expect(result.every((point) => point.enemies.type === EnemyType.SOLDIER)).toBe(true);
    });
  });
});
