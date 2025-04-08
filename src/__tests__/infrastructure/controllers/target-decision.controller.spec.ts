import { TargetDecisionController } from '@infrastructure/controllers/target-decision.controller';
import { GetAllTargetDecisionsUseCase, GetTargetDecisionByIdUseCase } from '@application/use-cases';
import { DeleteTargetDecisionUseCase } from '@application/use-cases/delete-target-decision.usecase';
import { Request, Response } from 'express';
import { TargetDecision } from '@domain/entities';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';
import { GetTargetDecisionDto } from '@application/dtos/get-target-decision.dto';

jest.mock('@application/use-cases/get-all-target-decisions.usecase');
jest.mock('@application/use-cases/get-target-decision-by-id.usecase');
jest.mock('@application/use-cases/delete-target-decision.usecase');

describe('TargetDecisionController', () => {
  let controller: TargetDecisionController;
  let getAllUseCase: jest.Mocked<GetAllTargetDecisionsUseCase>;
  let getByIdUseCase: jest.Mocked<GetTargetDecisionByIdUseCase>;
  let deleteUseCase: jest.Mocked<DeleteTargetDecisionUseCase>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;
  let mockRepository: jest.Mocked<TargetDecisionRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<TargetDecisionRepository>;

    getAllUseCase = new GetAllTargetDecisionsUseCase(
      mockRepository,
    ) as jest.Mocked<GetAllTargetDecisionsUseCase>;
    getByIdUseCase = new GetTargetDecisionByIdUseCase(
      mockRepository,
    ) as jest.Mocked<GetTargetDecisionByIdUseCase>;
    deleteUseCase = new DeleteTargetDecisionUseCase(
      mockRepository,
    ) as jest.Mocked<DeleteTargetDecisionUseCase>;

    controller = new TargetDecisionController(getAllUseCase, getByIdUseCase, deleteUseCase);

    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson, send: mockSend });
    mockResponse = {
      json: mockJson,
      status: mockStatus,
      send: mockSend,
    };
  });

  describe('getAll', () => {
    it('should return all decisions on successful execution', async () => {
      const mockDecisions = [
        new TargetDecision([ProtocolType.CLOSEST_ENEMIES], [], new Coordinates(0, 1)),
        new TargetDecision([ProtocolType.AVOID_MECH], [], new Coordinates(2, 3)),
      ];

      getAllUseCase.execute.mockResolvedValue(mockDecisions);

      await controller.getAll({} as Request, mockResponse as Response);

      expect(getAllUseCase.execute).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockDecisions);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle errors with 500 status', async () => {
      const error = new Error('Database error');
      getAllUseCase.execute.mockRejectedValue(error);

      await controller.getAll({} as Request, mockResponse as Response);

      expect(getAllUseCase.execute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error getting decisions',
        error,
      });
    });
  });

  describe('getById', () => {
    const mockId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return decision when found', async () => {
      const mockDecision = new TargetDecision(
        [ProtocolType.CLOSEST_ENEMIES],
        [],
        new Coordinates(0, 1),
        mockId,
      );

      getByIdUseCase.execute.mockResolvedValue(mockDecision);

      const mockRequest = {
        params: { id: mockId },
      } as Request<GetTargetDecisionDto>;

      await controller.getById(mockRequest, mockResponse as Response);

      expect(getByIdUseCase.execute).toHaveBeenCalledWith({ id: mockId });
      expect(mockJson).toHaveBeenCalledWith(mockDecision);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should return 404 when decision not found', async () => {
      getByIdUseCase.execute.mockResolvedValue(null);

      const mockRequest = {
        params: { id: mockId },
      } as Request<GetTargetDecisionDto>;

      await controller.getById(mockRequest, mockResponse as Response);

      expect(getByIdUseCase.execute).toHaveBeenCalledWith({ id: mockId });
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Decision not found' });
    });

    it('should handle errors with 500 status', async () => {
      const error = new Error('Database error');
      getByIdUseCase.execute.mockRejectedValue(error);

      const mockRequest = {
        params: { id: mockId },
      } as Request<GetTargetDecisionDto>;

      await controller.getById(mockRequest, mockResponse as Response);

      expect(getByIdUseCase.execute).toHaveBeenCalledWith({ id: mockId });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error getting decision',
        error,
      });
    });
  });

  describe('delete', () => {
    const mockId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return 204 on successful deletion', async () => {
      deleteUseCase.execute.mockResolvedValue(mockId);

      const mockRequest = {
        params: { id: mockId },
      } as Request<GetTargetDecisionDto>;

      await controller.delete(mockRequest, mockResponse as Response);

      expect(deleteUseCase.execute).toHaveBeenCalledWith({ id: mockId });
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it('should handle errors with 500 status', async () => {
      const error = new Error('Database error');
      deleteUseCase.execute.mockRejectedValue(error);

      const mockRequest = {
        params: { id: mockId },
      } as Request<GetTargetDecisionDto>;

      await controller.delete(mockRequest, mockResponse as Response);

      expect(deleteUseCase.execute).toHaveBeenCalledWith({ id: mockId });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error deleting decision',
        error,
      });
    });
  });
});
