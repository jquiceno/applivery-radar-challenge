import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';
import { TargetDecision } from '@domain/entities';

export class MongooseDecisionRepositoryMock implements TargetDecisionRepository {
  private decisions: TargetDecision[] = [];

  create(decision: TargetDecision): Promise<string> {
    this.decisions.push(decision);
    return Promise.resolve(decision.id);
  }

  findAll(): Promise<TargetDecision[]> {
    return Promise.resolve(this.decisions);
  }

  findById(id: string): Promise<TargetDecision | null> {
    return Promise.resolve(this.decisions.find((decision) => decision.id === id) || null);
  }

  delete(id: string): Promise<string> {
    this.decisions = this.decisions.filter((decision) => decision.id !== id);
    return Promise.resolve(id);
  }

  // Helper methods for testing
  setDecisions(decisions: TargetDecision[]): void {
    this.decisions = decisions;
  }

  clear(): void {
    this.decisions = [];
  }
}
