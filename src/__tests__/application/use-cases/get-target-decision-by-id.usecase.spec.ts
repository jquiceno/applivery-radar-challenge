import { GetTargetDecisionByIdUseCase } from '@application/use-cases/get-target-decision-by-id.usecase';
import { MongooseDecisionRepositoryMock } from '../../__mocks__/infrastructure/repositories/mongoose-decision.repository.mock';
import { TargetDecision } from '@domain/entities';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';
import { GetTargetDecisionDto } from '@application/dtos/get-target-decision.dto';

describe('GetTargetDecisionByIdUseCase', () => {
  let useCase: GetTargetDecisionByIdUseCase;
  let repository: MongooseDecisionRepositoryMock;

  beforeEach(() => {
    repository = new MongooseDecisionRepositoryMock();
    useCase = new GetTargetDecisionByIdUseCase(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  it('should return null when decision does not exist', async () => {
    const dto: GetTargetDecisionDto = { id: 'non-existent-id' };
    const result = await useCase.execute(dto);
    expect(result).toBeNull();
  });

  it('should return the decision when it exists', async () => {
    const mockDecision = new TargetDecision(
      [ProtocolType.CLOSEST_ENEMIES],
      [new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1), 0)],
      new Coordinates(0, 0),
      '1',
      new Date(),
    );

    repository.setDecisions([mockDecision]);

    const dto: GetTargetDecisionDto = { id: '1' };
    const result = await useCase.execute(dto);
    expect(result).toEqual(mockDecision);
  });
});
