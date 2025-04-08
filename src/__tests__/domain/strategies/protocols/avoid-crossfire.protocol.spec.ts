import { AvoidCrossfireProtocol } from '@domain/strategies/protocols/avoid-crossfire.strategy';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('AvoidCrossfireProtocol', () => {
  let protocol: AvoidCrossfireProtocol;

  beforeEach(() => {
    protocol = new AvoidCrossfireProtocol();
  });

  describe('apply', () => {
    it('should return empty array when scan points array is empty', () => {
      const result = protocol.apply([]);
      expect(result).toEqual([]);
    });

    it('should return array with point without allies when available', () => {
      const scanPoints = [
        new ScanPoint(
          new Coordinates(0, 10),
          new Enemy(EnemyType.SOLDIER, 1),
          2, // Has allies
        ),
        new ScanPoint(
          new Coordinates(3, 4),
          new Enemy(EnemyType.SOLDIER, 1),
          0, // No allies
        ),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(3, 4));
    });

    it('should return empty array when all points have allies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1), 1),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 2),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toEqual([]);
    });

    it('should return array with all points that have no allies', () => {
      const scanPoints = [
        new ScanPoint(
          new Coordinates(0, 10), // distance = 10
          new Enemy(EnemyType.SOLDIER, 1),
          0,
        ),
        new ScanPoint(
          new Coordinates(3, 4), // distance = 5
          new Enemy(EnemyType.SOLDIER, 1),
          0,
        ),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(3, 4));
    });

    it('should treat undefined allies as zero allies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.SOLDIER, 1)),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 1),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
    });

    it('should return all points without allies regardless of validity', () => {
      const scanPoints = [
        new ScanPoint(
          new Coordinates(100, 100), // Invalid due to distance > 100
          new Enemy(EnemyType.SOLDIER, 1),
          0,
        ),
        new ScanPoint(
          new Coordinates(3, 4), // Valid point
          new Enemy(EnemyType.SOLDIER, 1),
          0,
        ),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(100, 100));
      expect(result[1].coordinates).toEqual(new Coordinates(3, 4));
    });

    it('should work with both soldier and mech enemies', () => {
      const scanPoints = [
        new ScanPoint(new Coordinates(0, 10), new Enemy(EnemyType.MECH, 1), 0),
        new ScanPoint(new Coordinates(3, 4), new Enemy(EnemyType.SOLDIER, 1), 0),
      ];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual(new Coordinates(0, 10));
      expect(result[1].coordinates).toEqual(new Coordinates(3, 4));
    });

    it('should handle single scan point without allies', () => {
      const scanPoints = [new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 0)];

      const result = protocol.apply(scanPoints);
      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual(new Coordinates(5, 5));
    });

    it('should handle single scan point with allies', () => {
      const scanPoints = [new ScanPoint(new Coordinates(5, 5), new Enemy(EnemyType.SOLDIER, 1), 1)];

      const result = protocol.apply(scanPoints);
      expect(result).toEqual([]);
    });
  });
});
