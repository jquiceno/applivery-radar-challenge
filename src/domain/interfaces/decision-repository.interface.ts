import { TargetDecision } from '../entities/target-decision.entity';

export interface TargetDecisionRepository {
  create(decision: TargetDecision): Promise<string>;
  findAll(): Promise<TargetDecision[] | null>;
  findById(id: string): Promise<TargetDecision | null>;
  delete(id: string): Promise<string>;
}
