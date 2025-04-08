import { TargetDecision } from '@domain/entities';
import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';
import { GetTargetDecisionDto } from '../dtos/get-target-decision.dto';

export class GetTargetDecisionByIdUseCase {
  constructor(private readonly repository: TargetDecisionRepository) {}

  async execute(dto: GetTargetDecisionDto): Promise<TargetDecision | null> {
    return this.repository.findById(dto.id);
  }
}
