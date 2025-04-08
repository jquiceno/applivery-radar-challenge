import { ProtocolStrategy } from '../../interfaces';
import { ScanPoint } from '../../value-objects';
import { EnemyType } from '../../enums';

export class PrioritizeMechProtocol implements ProtocolStrategy {
  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    if (scanPoints.length === 0) return [];

    return [...scanPoints].sort((a, b) => {
      const aIsMech = a.enemies.type === EnemyType.MECH ? 0 : 1;
      const bIsMech = b.enemies.type === EnemyType.MECH ? 0 : 1;
      return aIsMech - bIsMech;
    });
  }
}
