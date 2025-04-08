import { FurthestEnemiesProtocol } from '@domain/strategies/protocols/furthest-enemies.strategy';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('FurthestEnemiesProtocol', () => {
  let protocol: FurthestEnemiesProtocol;

  beforeEach(() => {
    protocol = new FurthestEnemiesProtocol();
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

    it('should return the furthest point from origin (0,0)', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(10, 10), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 14.14
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(5, 0), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 2.83
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(10, 10)); // Furthest
    });

    it('should work with negative coordinates', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(-6, -8), new Enemy(EnemyType.SOLDIER, 1)), // distance = 10
        new ScanPoint(new Coordinates(0, 2), new Enemy(EnemyType.SOLDIER, 1)), // distance = 2
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(-6, -8)); // Furthest
    });

    it('should work with different enemy types', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.MECH, 2)), // distance ≈ 7.07
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 2.83
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(5, 5)); // Furthest
    });

    it('should handle points at (0,0)', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1)), // distance ≈ 7.07
        new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1)), // distance = 0
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(5, 5)); // Furthest
    });

    it('should handle points with very large coordinates', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1000, 1000), new Enemy(EnemyType.SOLDIER, 1)), // Large distance
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1)), // Small distance
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(1000, 1000)); // Furthest
    });

    it('should preserve all point properties of the furthest point', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.MECH, 2), 3), // Furthest
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1), 2), // Closer
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);

      // Check furthest point maintains all properties
      expect(result[0].coordinates).toEqual(new Coordinates(5, 5));
      expect(result[0].enemies.type).toBe(EnemyType.MECH);
      expect(result[0].enemies.number).toBe(2);
      expect(result[0].allies).toBe(3);
    });

    it('should handle points with equal distances and return the first one found', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
        new ScanPoint(new Coordinates(4, 3), new Enemy(EnemyType.MECH, 1)), // distance = 5
        new ScanPoint(new Coordinates(0, 5), new Enemy(EnemyType.SOLDIER, 1)), // distance = 5
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(3, 4)); // First point at max distance
    });

    it('should work with invalid points (distance > 100)', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1000, 1000), new Enemy(EnemyType.SOLDIER, 1)), // Invalid due to distance
        new ScanPoint(new Coordinates(50, 50), new Enemy(EnemyType.SOLDIER, 1)), // Valid point
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(1000, 1000));
      expect(result[0].valid).toBe(false);
    });
  });
});
