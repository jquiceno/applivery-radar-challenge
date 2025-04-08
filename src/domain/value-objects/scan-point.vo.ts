import { Coordinates } from './coordinates.vo';
import { Enemy } from './enemy.vo';

export class ScanPoint {
  constructor(
    public readonly coordinates: Coordinates,
    public readonly enemies: Enemy,
    public readonly allies?: number,
    public readonly valid: boolean = true,
    public readonly origin: Coordinates = new Coordinates(0, 0),
  ) {
    if (this.getDistanceToOrigin() > 100) {
      this.valid = false;
    }
  }

  getDistanceToOrigin(): number {
    return this.coordinates.distanceTo(this.origin);
  }
}
