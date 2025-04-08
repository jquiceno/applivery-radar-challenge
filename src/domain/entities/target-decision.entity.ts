import { ScanPoint } from '../value-objects/scan-point.vo';
import { Coordinates } from '../value-objects/coordinates.vo';
import { ProtocolType } from '../enums/protocol-type.enum';
import { v4 as uuidv4 } from 'uuid';

export class TargetDecision {
  constructor(
    public readonly protocols: ProtocolType[],
    public readonly scan: ScanPoint[],
    public readonly target: Coordinates,
    public readonly id: string = uuidv4(),
    public readonly createdAt: Date = new Date(),
  ) {}
}
