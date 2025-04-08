export class Coordinates {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  distanceTo(other: Coordinates): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
}
