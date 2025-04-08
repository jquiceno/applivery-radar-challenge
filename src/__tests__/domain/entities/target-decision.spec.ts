import { TargetDecision } from '@domain/entities';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('TargetDecision', () => {
  it('should create a target decision with all properties', () => {
    const protocols = [ProtocolType.CLOSEST_ENEMIES];
    const scan = [new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1), 0)];
    const target = new Coordinates(0, 0);
    const id = '1';
    const createdAt = new Date();

    const decision = new TargetDecision(protocols, scan, target, id, createdAt);

    expect(decision.protocols).toEqual(protocols);
    expect(decision.scan).toEqual(scan);
    expect(decision.target).toBe(target);
    expect(decision.id).toBe(id);
    expect(decision.createdAt).toBe(createdAt);
  });

  it('should create a target decision with multiple protocols', () => {
    const protocols = [ProtocolType.CLOSEST_ENEMIES, ProtocolType.AVOID_CROSSFIRE];
    const scan = [new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1), 0)];
    const target = new Coordinates(0, 0);

    const decision = new TargetDecision(protocols, scan, target, '1', new Date());

    expect(decision.protocols).toHaveLength(2);
    expect(decision.protocols).toContain(ProtocolType.CLOSEST_ENEMIES);
    expect(decision.protocols).toContain(ProtocolType.AVOID_CROSSFIRE);
  });

  it('should create a target decision with multiple scan points', () => {
    const protocols = [ProtocolType.CLOSEST_ENEMIES];
    const scan = [
      new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1), 0),
      new ScanPoint(new Coordinates(1, 1), new Enemy(EnemyType.MECH, 2), 1),
    ];
    const target = new Coordinates(0, 0);

    const decision = new TargetDecision(protocols, scan, target, '1', new Date());

    expect(decision.scan).toHaveLength(2);
    expect(decision.scan[0].coordinates).toEqual(new Coordinates(0, 0));
    expect(decision.scan[1].coordinates).toEqual(new Coordinates(1, 1));
  });

  it('should generate uuid if id is not provided', () => {
    const decision = new TargetDecision(
      [ProtocolType.CLOSEST_ENEMIES],
      [new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1))],
      new Coordinates(0, 0),
    );

    expect(decision.id).toBeDefined();
    expect(typeof decision.id).toBe('string');
    expect(decision.id.length).toBe(36); // UUID length
  });

  it('should use current date if createdAt is not provided', () => {
    const decision = new TargetDecision(
      [ProtocolType.CLOSEST_ENEMIES],
      [new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1))],
      new Coordinates(0, 0),
    );

    expect(decision.createdAt).toBeDefined();
    expect(decision.createdAt instanceof Date).toBe(true);
  });
});
