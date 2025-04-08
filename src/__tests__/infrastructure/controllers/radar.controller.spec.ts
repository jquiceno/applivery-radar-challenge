import { DecideTargetController } from '@infrastructure/controllers/radar.controller';
import { DecideTargetUseCase } from '@application/use-cases';
import { DecideTargetDto } from '@application/dtos/decide-target.dto';
import { Request, Response } from 'express';
import { TargetDecision } from '@domain/entities';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { EnemyType } from '@domain/enums/enemy-type.enum';
import { ProtocolStrategyFactory } from '@domain/factories';
import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';

jest.mock('@application/use-cases/decide-target.usecase');
jest.mock('@domain/factories/protocol-strategy.factory');

describe('DecideTargetController', () => {
  let controller: DecideTargetController;
  let useCase: jest.Mocked<DecideTargetUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockFactory: jest.Mocked<ProtocolStrategyFactory>;
  let mockRepository: jest.Mocked<TargetDecisionRepository>;

  beforeEach(() => {
    mockFactory = new ProtocolStrategyFactory() as jest.Mocked<ProtocolStrategyFactory>;
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<TargetDecisionRepository>;

    useCase = new DecideTargetUseCase(
      mockFactory,
      mockRepository,
    ) as jest.Mocked<DecideTargetUseCase>;
    controller = new DecideTargetController(useCase);

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe('execute', () => {
    const mockDto: DecideTargetDto = {
      scan: [
        {
          coordinates: { x: 0, y: 1 },
          enemies: { type: EnemyType.SOLDIER, number: 1 },
          allies: 0,
          valid: true,
        },
      ],
      protocols: [ProtocolType.CLOSEST_ENEMIES],
    };

    it('should return target coordinates on successful execution', async () => {
      const mockTarget = new Coordinates(0, 1);
      const mockDecision = new TargetDecision([ProtocolType.CLOSEST_ENEMIES], [], mockTarget);
      useCase.execute.mockResolvedValue(mockDecision);

      mockRequest = {
        body: mockDto,
      };

      await controller.execute(
        mockRequest as Request<any, any, DecideTargetDto>,
        mockResponse as Response,
      );

      expect(useCase.execute).toHaveBeenCalledWith(mockDto);
      expect(mockJson).toHaveBeenCalledWith(mockTarget);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle known errors with 500 status and error message', async () => {
      const errorMessage = 'Known error occurred';
      useCase.execute.mockRejectedValue(new Error(errorMessage));

      mockRequest = {
        body: mockDto,
      };

      await controller.execute(
        mockRequest as Request<any, any, DecideTargetDto>,
        mockResponse as Response,
      );

      expect(useCase.execute).toHaveBeenCalledWith(mockDto);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should handle unknown errors with 500 status and generic message', async () => {
      useCase.execute.mockRejectedValue('Unknown error');

      mockRequest = {
        body: mockDto,
      };

      await controller.execute(
        mockRequest as Request<any, any, DecideTargetDto>,
        mockResponse as Response,
      );

      expect(useCase.execute).toHaveBeenCalledWith(mockDto);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'An unexpected error occurred' });
    });

    it('should pass the DTO to the use case without modification', async () => {
      const mockTarget = new Coordinates(0, 1);
      const mockDecision = new TargetDecision([ProtocolType.CLOSEST_ENEMIES], [], mockTarget);
      useCase.execute.mockResolvedValue(mockDecision);

      const complexDto: DecideTargetDto = {
        scan: [
          {
            coordinates: { x: 0, y: 1 },
            enemies: { type: EnemyType.SOLDIER, number: 1 },
            allies: 0,
            valid: true,
          },
          {
            coordinates: { x: 5, y: 5 },
            enemies: { type: EnemyType.MECH, number: 2 },
            allies: 3,
            valid: true,
          },
        ],
        protocols: [ProtocolType.CLOSEST_ENEMIES, ProtocolType.AVOID_MECH],
      };

      mockRequest = {
        body: complexDto,
      };

      await controller.execute(
        mockRequest as Request<any, any, DecideTargetDto>,
        mockResponse as Response,
      );

      expect(useCase.execute).toHaveBeenCalledWith(complexDto);
      expect(mockJson).toHaveBeenCalledWith(mockTarget);
    });
  });
});
