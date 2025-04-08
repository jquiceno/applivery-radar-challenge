import { ProtocolStrategy } from '../../interfaces/protocol.interface';
import { ScanPoint } from '../../value-objects/scan-point.vo';

export class AvoidCrossfireProtocol implements ProtocolStrategy {
  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    if (!scanPoints.length) return [];

    return scanPoints.filter((s) => !s.allies || s.allies === 0);
  }
}
