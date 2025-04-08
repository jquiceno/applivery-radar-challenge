import { DeleteTargetDecisionUseCase } from '@application/use-cases/delete-target-decision.usecase';
import { MongooseDecisionRepositoryMock } from '../../__mocks__/infrastructure/repositories/mongoose-decision.repository.mock';
import { TargetDecision } from '@domain/entities';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';
import { EnemyType } from '@domain/enums/enemy-type.enum';
import { GetTargetDecisionDto } from '@application/dtos/get-target-decision.dto';

describe('DeleteTargetDecisionUseCase', () => {
  let useCase: DeleteTargetDecisionUseCase;
  let repository: MongooseDecisionRepositoryMock;

  beforeEach(() => {
    repository = new MongooseDecisionRepositoryMock();
    useCase = new DeleteTargetDecisionUseCase(repository);
  });

  afterEach(() => {
    repository.clear();
  });

  it('should delete the decision and return its id', async () => {
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

    expect(result).toBe('1');
    expect(await repository.findById('1')).toBeNull();
  });
});
