import { AssistAlliesProtocol } from '@domain/strategies/protocols/assist-allies.strategy';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('AssistAlliesProtocol', () => {
  let protocol: AssistAlliesProtocol;

  beforeEach(() => {
    protocol = new AssistAlliesProtocol();
  });

  describe('apply', () => {
    it('should return empty array when scan points array is empty', () => {
      const result = protocol.apply([]);
      expect(result).toEqual([]);
    });

    it('should return array with only points that have allies', () => {
      const scanPoints = [
        new ScanPoint(
          new Coordinates(0, 10),
          new Enemy(EnemyType.SOLDIER, 1),
          3, // Has allies
        ),
        new ScanPoint(
          new Coordinates(3, 4),
          new Enemy(EnemyType.SOLDIER, 1),
          0, // No allies
        ),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[0].allies).toBe(3);
    });

    it('should return empty array when no points have allies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 0),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toEqual([]);
    });

    it('should maintain original order of points with allies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 2),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 0),
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 5),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(5, 5));
    });

    it('should work with both soldier and mech enemies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.MECH, 1), 3),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 2),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(3, 4));
    });

    it('should ignore point validity when filtering', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(100, 100), new Enemy(EnemyType.SOLDIER, 1), 3), // Invalid due to distance
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(100, 100));
      expect(result[0].valid).toBe(false);
    });

    it('should handle single scan point with allies', () => {
      const scanPoints = [new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 3)];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(5, 5));
    });

    it('should handle single scan point without allies', () => {
      const scanPoints = [new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 0)];

      const result = protocol.apply(scanPoints);
      expect(result).toEqual([]);
    });

    it('should treat undefined allies as no allies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1)), // undefined allies
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 2),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(3, 4));
    });

    it('should work with multiple points with varying ally counts', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 5),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.MECH, 2), 0),
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 3), 3),
        new ScanPoint(new Coordinates(7, 7), new Enemy(EnemyType.MECH, 1), 1),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(3);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(5, 5));
      expect(result[2].coordinates).toEqual(new Coordinates(7, 7));
      expect(result.every((point) => point.allies && point.allies > 0)).toBe(true);
    });
  });
});
