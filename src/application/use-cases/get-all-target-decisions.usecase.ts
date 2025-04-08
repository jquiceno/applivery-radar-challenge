import { TargetDecision } from '@domain/entities';
import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';

export class GetAllTargetDecisionsUseCase {
  constructor(private readonly repository: TargetDecisionRepository) {}

  async execute(): Promise<TargetDecision[] | null> {
    return this.repository.findAll();
  }
}
