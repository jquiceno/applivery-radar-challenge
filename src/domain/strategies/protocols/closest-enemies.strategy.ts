import { ProtocolStrategy } from '../../interfaces/protocol.interface';
import { ScanPoint } from '../../value-objects';

export class ClosestEnemiesProtocol implements ProtocolStrategy {
  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    return [...scanPoints].sort((a, b) => a.getDistanceToOrigin() - b.getDistanceToOrigin());
  }
}
