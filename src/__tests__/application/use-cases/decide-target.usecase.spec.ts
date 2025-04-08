import { DecideTargetUseCase } from '@application/use-cases/decide-target.usecase';
import { ProtocolStrategyFactory } from '@domain/factories';
import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';
import { DecideTargetDto } from '@application/dtos/decide-target.dto';
import { EnemyType, ProtocolType } from '@domain/enums';
import { TargetDecision } from '@domain/entities';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';

describe('DecideTargetUseCase', () => {
  let useCase: DecideTargetUseCase;
  let protocolStrategyFactory: jest.Mocked<ProtocolStrategyFactory>;
  let repository: jest.Mocked<TargetDecisionRepository>;

  beforeEach(() => {
    protocolStrategyFactory = {
      get: jest.fn(),
    } as any;

    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DecideTargetUseCase(protocolStrategyFactory, repository);
  });

  describe('execute', () => {
    it('should successfully process scan data and create a decision', async () => {
      // Arrange
      const mockInput: DecideTargetDto = {
        protocols: [ProtocolType.CLOSEST_ENEMIES],
        scan: [
          {
            coordinates: { x: 1, y: 1 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: true,
          },
        ],
      };

      const mockStrategy = {
        apply: jest.fn().mockImplementation((points) => points),
      };

      protocolStrategyFactory.get.mockReturnValue(mockStrategy);
      repository.create.mockResolvedValue('mock-id');

      // Act
      const result = await useCase.execute(mockInput);

      // Assert
      expect(result).toBeInstanceOf(TargetDecision);
      expect(result.protocols).toEqual(mockInput.protocols);
      expect(result.scan).toHaveLength(1);
      expect(result.scan[0]).toBeInstanceOf(ScanPoint);
      expect(result.target).toBeInstanceOf(Coordinates);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(protocolStrategyFactory.get).toHaveBeenCalledWith(ProtocolType.CLOSEST_ENEMIES);
    });

    it('should reorder protocols to prioritize avoid protocols', async () => {
      // Arrange
      const mockInput: DecideTargetDto = {
        protocols: [ProtocolType.CLOSEST_ENEMIES, ProtocolType.AVOID_MECH],
        scan: [
          {
            coordinates: { x: 1, y: 1 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: true,
          },
        ],
      };

      const mockStrategy = {
        apply: jest.fn().mockImplementation((points) => points),
      };

      protocolStrategyFactory.get.mockReturnValue(mockStrategy);
      repository.create.mockResolvedValue('mock-id');

      // Act
      const result = await useCase.execute(mockInput);

      // Assert
      expect(result.protocols[0]).toBe(ProtocolType.AVOID_MECH);
      expect(result.protocols[1]).toBe(ProtocolType.CLOSEST_ENEMIES);
      expect(protocolStrategyFactory.get).toHaveBeenCalledTimes(2);
    });

    it('should throw error when no scan points are provided', async () => {
      // Arrange
      const mockInput: DecideTargetDto = {
        protocols: [ProtocolType.CLOSEST_ENEMIES],
        scan: [],
      };

      // Act & Assert
      await expect(useCase.execute(mockInput)).rejects.toThrow('No scan points provided.');
    });

    it('should throw error when no valid targets remain after applying protocols', async () => {
      // Arrange
      const mockInput: DecideTargetDto = {
        protocols: [ProtocolType.CLOSEST_ENEMIES],
        scan: [
          {
            coordinates: { x: 1, y: 1 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: true,
          },
        ],
      };

      const mockStrategy = {
        apply: jest.fn().mockReturnValue([]),
      };

      protocolStrategyFactory.get.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(useCase.execute(mockInput)).rejects.toThrow(
        'No target found after applying protocols.',
      );
    });

    it('should filter out invalid scan points before applying protocols', async () => {
      // Arrange
      const mockInput: DecideTargetDto = {
        protocols: [ProtocolType.CLOSEST_ENEMIES],
        scan: [
          {
            coordinates: { x: 1, y: 1 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: false, // Invalid point
          },
          {
            coordinates: { x: 2, y: 2 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: true, // Valid point
          },
        ],
      };

      const mockStrategy = {
        apply: jest.fn().mockImplementation((points) => points),
      };

      protocolStrategyFactory.get.mockReturnValue(mockStrategy);
      repository.create.mockResolvedValue('mock-id');

      // Act
      const result = await useCase.execute(mockInput);

      // Assert
      expect(result.scan).toHaveLength(2); // All scan points are kept in the decision
      expect(mockStrategy.apply).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            coordinates: expect.objectContaining({ x: 2, y: 2 }),
          }),
        ]),
      );
      // Verify that only valid points are passed to the strategy
      const pointsPassedToStrategy = mockStrategy.apply.mock.calls[0][0];
      expect(pointsPassedToStrategy.every((point: ScanPoint) => point.valid)).toBe(true);
    });

    it('should handle multiple protocols in sequence', async () => {
      // Arrange
      const mockInput: DecideTargetDto = {
        protocols: [ProtocolType.CLOSEST_ENEMIES, ProtocolType.AVOID_CROSSFIRE],
        scan: [
          {
            coordinates: { x: 1, y: 1 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: true,
          },
        ],
      };

      const mockStrategy1 = {
        apply: jest.fn().mockImplementation((points) => points),
      };

      const mockStrategy2 = {
        apply: jest.fn().mockImplementation((points) => points),
      };

      protocolStrategyFactory.get
        .mockReturnValueOnce(mockStrategy2) // AVOID_CROSSFIRE should be first
        .mockReturnValueOnce(mockStrategy1); // CLOSEST_ENEMIES should be second

      repository.create.mockResolvedValue('mock-id');

      await useCase.execute(mockInput);

      // Assert
      expect(protocolStrategyFactory.get).toHaveBeenCalledTimes(2);
      expect(protocolStrategyFactory.get).toHaveBeenCalledWith(ProtocolType.AVOID_CROSSFIRE);
      expect(protocolStrategyFactory.get).toHaveBeenCalledWith(ProtocolType.CLOSEST_ENEMIES);
      expect(mockStrategy2.apply).toHaveBeenCalled();
      expect(mockStrategy1.apply).toHaveBeenCalled();
      const strategy2CallIndex = mockStrategy2.apply.mock.invocationCallOrder[0];
      const strategy1CallIndex = mockStrategy1.apply.mock.invocationCallOrder[0];
      expect(strategy2CallIndex).toBeLessThan(strategy1CallIndex);
    });
  });
});
