import { MongooseDecisionRepository } from '@infrastructure/repositories/mongoose-decision.repository';
import { DecisionModel } from '@infrastructure/schemas/decision.schema';
import { TargetDecision } from '@domain/entities';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

jest.mock('@infrastructure/schemas/decision.schema');

describe('MongooseDecisionRepository', () => {
  let repository: MongooseDecisionRepository;
  let mockDecision: TargetDecision;

  beforeEach(() => {
    repository = new MongooseDecisionRepository();
    const coordinates = new Coordinates(1, 1);
    const enemy = new Enemy(EnemyType.SOLDIER, 1);
    const scanPoint = new ScanPoint(coordinates, enemy, 0);
    mockDecision = new TargetDecision([ProtocolType.CLOSEST_ENEMIES], [scanPoint], coordinates);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new target decision', async () => {
      const mockCreatedDecision = { _id: 'mockId', ...mockDecision };
      (DecisionModel.create as jest.Mock).mockResolvedValueOnce(mockCreatedDecision);

      const result = await repository.create(mockDecision);

      expect(DecisionModel.create).toHaveBeenCalledWith({
        protocols: mockDecision.protocols,
        scan: mockDecision.scan.map((point) => ({
          coordinates: point.coordinates,
          enemies: point.enemies,
          allies: point.allies,
        })),
        target: mockDecision.target,
        id: mockDecision.id,
      });
      expect(result).toBe('mockId');
    });

    it('should throw an error if creation fails', async () => {
      const error = new Error('Database error');
      (DecisionModel.create as jest.Mock).mockRejectedValueOnce(error);

      await expect(repository.create(mockDecision)).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should find a target decision by id', async () => {
      const mockFoundDecision = {
        protocols: mockDecision.protocols,
        scan: mockDecision.scan.map((point) => ({
          coordinates: point.coordinates,
          enemies: [
            {
              type: point.enemies.type,
              number: point.enemies.number,
            },
          ],
          allies: point.allies,
        })),
        target: mockDecision.target,
        id: mockDecision.id,
        createdAt: new Date(),
      };
      (DecisionModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(mockFoundDecision),
      });

      const result = await repository.findById(mockDecision.id);

      expect(DecisionModel.findOne).toHaveBeenCalledWith({ id: mockDecision.id });
      expect(result).toBeInstanceOf(TargetDecision);
      expect(result?.id).toBe(mockDecision.id);
    });

    it('should return null if decision is not found', async () => {
      (DecisionModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a target decision', async () => {
      (DecisionModel.deleteOne as jest.Mock).mockResolvedValueOnce({ deletedCount: 1 });

      const result = await repository.delete(mockDecision.id);

      expect(DecisionModel.deleteOne).toHaveBeenCalledWith({ id: mockDecision.id });
      expect(result).toBe(mockDecision.id);
    });

    it('should return the id even if the decision was not found', async () => {
      (DecisionModel.deleteOne as jest.Mock).mockResolvedValueOnce({ deletedCount: 0 });

      const result = await repository.delete('nonexistent-id');

      expect(result).toBe('nonexistent-id');
    });
  });
});
