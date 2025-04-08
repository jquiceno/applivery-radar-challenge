import { ClosestEnemiesProtocol } from '@domain/strategies/protocols/closest-enemies.strategy';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('ClosestEnemiesProtocol', () => {
  let protocol: ClosestEnemiesProtocol;

  beforeEach(() => {
    protocol = new ClosestEnemiesProtocol();
  });

  describe('apply', () => {
    it('should return empty array when scan points array is empty', () => {
      const result = protocol.apply([]);
      expect(result).toEqual([]);
    });

    it('should return single point array unchanged', () => {
      const scanPoint = new ScanPoint(new Coordinates(10, 10), new Enemy(EnemyType.SOLDIER, 1), 0);
      const result = protocol.apply([scanPoint]);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(scanPoint);
    });

    it('should sort points by distance from origin (0,0)', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(10, 10), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 14.14
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(5, 0), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 2.83
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(4);
      expect(result[0].coordinates).toEqual(new Coordinates(2, 2)); // Closest
      expect(result[1].coordinates).toEqual(new Coordinates(3, 4)); // Second closest (tie)
      expect(result[2].coordinates).toEqual(new Coordinates(5, 0)); // Second closest (tie)
      expect(result[3].coordinates).toEqual(new Coordinates(10, 10)); // Farthest
    });

    it('should maintain relative order of points with equal distances', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(4, 3), new Enemy(EnemyType.MECH, 1)), // distance = 5
        new ScanPoint(new Coordinates(0, 5), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
      ];

      const result = protocol.apply(scanPoints);

      // All points have same distance, should maintain original order
      expect(result).toHaveLength(3);
      expect(result[0].coordinates).toEqual(new Coordinates(3, 4));
      expect(result[1].coordinates).toEqual(new Coordinates(4, 3));
      expect(result[2].coordinates).toEqual(new Coordinates(0, 5));
    });

    it('should work with negative coordinates', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(-3, -4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(0, 2), new Enemy(EnemyType.SOLDIER, 1)), // distance = 2
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 2)); // Closer
      expect(result[1].coordinates).toEqual(new Coordinates(-3, -4)); // Farther
    });

    it('should work with different enemy types', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.MECH, 2)), // distance ≈ 7.07
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 2.83
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(2, 2)); // Closer
      expect(result[1].coordinates).toEqual(new Coordinates(5, 5)); // Farther
    });

    it('should sort correctly with points at (0,0)', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 7.07
        new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1)), // distance = 0
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(3);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 0)); // At origin
      expect(result[1].coordinates).toEqual(new Coordinates(3, 4)); // Middle distance
      expect(result[2].coordinates).toEqual(new Coordinates(5, 5)); // Farthest
    });

    it('should handle points with very large coordinates', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1000, 1000), new Enemy(EnemyType.SOLDIER, 1)), // Large distance
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1)), // Small distance
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(1, 1)); // Closer
      expect(result[1].coordinates).toEqual(new Coordinates(1000, 1000)); // Farther
    });

    it('should preserve all point properties after sorting', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.MECH, 2), 3), // Farther
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1), 2), // Closer
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);

      // Check closest point maintains all properties
      expect(result[0].coordinates).toEqual(new Coordinates(1, 1));
      expect(result[0].enemies.type).toBe(EnemyType.SOLDIER);
      expect(result[0].enemies.number).toBe(1);
      expect(result[0].allies).toBe(2);

      // Check farthest point maintains all properties
      expect(result[1].coordinates).toEqual(new Coordinates(5, 5));
      expect(result[1].enemies.type).toBe(EnemyType.MECH);
      expect(result[1].enemies.number).toBe(2);
      expect(result[1].allies).toBe(3);
    });
  });
});
