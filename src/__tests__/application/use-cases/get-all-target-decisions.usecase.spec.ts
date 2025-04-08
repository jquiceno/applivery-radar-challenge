import { GetAllTargetDecisionsUseCase } from '@application/use-cases/get-all-target-decisions.usecase';
import { MongooseDecisionRepositoryMock } from '../../__mocks__/infrastructure/repositories/mongoose-decision.repository.mock';
import { TargetDecision } from '@domain/entities';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';

describe('GetAllTargetDecisionsUseCase', () => {
  let useCase: GetAllTargetDecisionsUseCase;
  let repository: MongooseDecisionRepositoryMock;

  beforeEach(() => {
    repository = new MongooseDecisionRepositoryMock();
    useCase = new GetAllTargetDecisionsUseCase(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  it('should return an empty array when no decisions exist', async () => {
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('should return all decisions', async () => {
    const mockDecisions = [
      new TargetDecision(
        [ProtocolType.CLOSEST_ENEMIES],
        [new ScanPoint(new Coordinates(0, 0), new Enemy(EnemyType.SOLDIER, 1), 0)],
        new Coordinates(0, 0),
        '1',
        new Date(),
      ),
      new TargetDecision(
        [ProtocolType.FURTHEST_ENEMIES],
        [new ScanPoint(new Coordinates(10, 10), new Enemy(EnemyType.MECH, 1), 0)],
        new Coordinates(10, 10),
        '2',
        new Date(),
      ),
    ];

    repository.setDecisions(mockDecisions);

    const result = await useCase.execute();
    expect(result).toEqual(mockDecisions);
  });
});
