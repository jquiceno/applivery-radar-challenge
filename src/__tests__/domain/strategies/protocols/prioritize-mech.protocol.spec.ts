import { PrioritizeMechProtocol } from '@domain/strategies/protocols/prioritize-mech.strategy';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('PrioritizeMechProtocol', () => {
  let protocol: PrioritizeMechProtocol;

  beforeEach(() => {
    protocol = new PrioritizeMechProtocol();
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

    it('should sort points prioritizing MECH enemies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1)),
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 1)),
        new ScanPoint(new Coordinates(3, 3), new Enemy(EnemyType.SOLDIER, 1)),
        new ScanPoint(new Coordinates(4, 4), new Enemy(EnemyType.MECH, 1)),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(4);
      expect(result[0].enemies.type).toBe(EnemyType.MECH);
      expect(result[1].enemies.type).toBe(EnemyType.MECH);
      expect(result[2].enemies.type).toBe(EnemyType.SOLDIER);
      expect(result[3].enemies.type).toBe(EnemyType.SOLDIER);
    });

    it('should maintain relative order of MECH points', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.MECH, 2)),
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 1)),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(1, 1));
      expect(result[1].coordinates).toEqual(new Coordinates(2, 2));
    });

    it('should maintain relative order of SOLDIER points', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 2)),
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.SOLDIER, 1)),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(1, 1));
      expect(result[1].coordinates).toEqual(new Coordinates(2, 2));
    });

    it('should work with different enemy quantities', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 5)),
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 1)),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].enemies.type).toBe(EnemyType.MECH);
      expect(result[1].enemies.type).toBe(EnemyType.SOLDIER);
    });

    it('should preserve all point properties after sorting', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1), 2),
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 2), 3),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);

      // Check MECH point maintains all properties
      expect(result[0].coordinates).toEqual(new Coordinates(2, 2));
      expect(result[0].enemies.type).toBe(EnemyType.MECH);
      expect(result[0].enemies.number).toBe(2);
      expect(result[0].allies).toBe(3);

      // Check SOLDIER point maintains all properties
      expect(result[1].coordinates).toEqual(new Coordinates(1, 1));
      expect(result[1].enemies.type).toBe(EnemyType.SOLDIER);
      expect(result[1].enemies.number).toBe(1);
      expect(result[1].allies).toBe(2);
    });

    it('should work with invalid points', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1000, 1000), new Enemy(EnemyType.SOLDIER, 1)), // Invalid due to distance
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 1)), // Valid point
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].enemies.type).toBe(EnemyType.MECH);
      expect(result[1].enemies.type).toBe(EnemyType.SOLDIER);
      expect(result[1].valid).toBe(false);
    });

    it('should work with points having different allies counts', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 1), 5),
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].enemies.type).toBe(EnemyType.MECH);
      expect(result[0].allies).toBe(0);
      expect(result[1].enemies.type).toBe(EnemyType.SOLDIER);
      expect(result[1].allies).toBe(5);
    });

    it('should handle mixed array with multiple properties', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.SOLDIER, 3), 2), // SOLDIER, more enemies
        new ScanPoint(new Coordinates(2, 2), new Enemy(EnemyType.MECH, 1), 3), // MECH, more allies
        new ScanPoint(new Coordinates(3, 3), new Enemy(EnemyType.SOLDIER, 1), 0), // SOLDIER, no allies
        new ScanPoint(new Coordinates(4, 4), new Enemy(EnemyType.MECH, 2), 1), // MECH, some allies
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(4);
      // MECH enemies should be first, in their original order
      expect(result[0].coordinates).toEqual(new Coordinates(2, 2));
      expect(result[1].coordinates).toEqual(new Coordinates(4, 4));
      // SOLDIER enemies should be last, in their original order
      expect(result[2].coordinates).toEqual(new Coordinates(1, 1));
      expect(result[3].coordinates).toEqual(new Coordinates(3, 3));
    });
  });
});
