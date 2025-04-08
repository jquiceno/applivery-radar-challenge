import { Coordinates } from '@domain/value-objects/coordinates.vo';

describe('Coordinates', () => {
  it('should create coordinates with x and y values', () => {
    const coordinates = new Coordinates(10, 20);
    expect(coordinates.x).toBe(10);
    expect(coordinates.y).toBe(20);
  });

  it('should calculate distance to another coordinate', () => {
    const coord1 = new Coordinates(0, 0);
    const coord2 = new Coordinates(3, 4);

    // Distance should be 5 (using Pythagorean theorem)
    expect(coord1.distanceTo(coord2)).toBe(5);
  });

  it('should handle negative coordinates', () => {
    const coord1 = new Coordinates(-1, -1);
    const coord2 = new Coordinates(2, 2);

    // Distance should be √18 ≈ 4.24
    expect(coord1.distanceTo(coord2)).toBeCloseTo(4.24, 2);
  });

  it('should return zero distance for same coordinates', () => {
    const coord = new Coordinates(5, 5);
    expect(coord.distanceTo(coord)).toBe(0);
  });

  it('should handle decimal coordinates', () => {
    const coord1 = new Coordinates(1.5, 2.5);
    const coord2 = new Coordinates(4.5, 6.5);

    // Distance should be 5
    expect(coord1.distanceTo(coord2)).toBeCloseTo(5, 2);
  });
});
