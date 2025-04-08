import { EnemyType } from '@src/domain/enums';
import { ProtocolStrategy } from '../../interfaces/protocol.interface';
import { ScanPoint } from '../../value-objects/scan-point.vo';

export class AvoidMechProtocol implements ProtocolStrategy {
  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    if (!scanPoints.length) return [];

    return scanPoints.filter((point) => point.enemies.type !== EnemyType.MECH);
  }
}
