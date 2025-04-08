import { ProtocolStrategy } from '../../interfaces/protocol.interface';
import { ScanPoint } from '../../value-objects/scan-point.vo';

export class FurthestEnemiesProtocol implements ProtocolStrategy {
  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    if (!scanPoints.length) return [];

    let [furthestPoint] = scanPoints;
    let maxDistance = furthestPoint.getDistanceToOrigin();

    for (const point of scanPoints) {
      const distance = point.getDistanceToOrigin();
      if (distance > maxDistance) {
        furthestPoint = point;
        maxDistance = distance;
      }
    }

    return [furthestPoint];
  }
}
