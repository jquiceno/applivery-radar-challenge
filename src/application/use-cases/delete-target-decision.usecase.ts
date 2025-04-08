import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';
import { GetTargetDecisionDto } from '../dtos/get-target-decision.dto';

export class DeleteTargetDecisionUseCase {
  constructor(private readonly repository: TargetDecisionRepository) {}

  async execute(dto: GetTargetDecisionDto): Promise<string> {
    return this.repository.delete(dto.id);
  }
}
