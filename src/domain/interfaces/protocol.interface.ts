import { ScanPoint } from '../value-objects/scan-point.vo';

export interface ProtocolStrategy {
  apply(scanPoints: ScanPoint[]): ScanPoint[];
}
