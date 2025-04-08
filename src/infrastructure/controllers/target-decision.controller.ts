import { Request, Response } from 'express';
import { GetAllTargetDecisionsUseCase, GetTargetDecisionByIdUseCase } from '@application/use-cases';
import { DeleteTargetDecisionUseCase } from '@application/use-cases/delete-target-decision.usecase';
import { GetTargetDecisionDto } from '@application/dtos/';

export class TargetDecisionController {
  constructor(
    private readonly getAllUseCase: GetAllTargetDecisionsUseCase,
    private readonly getByIdUseCase: GetTargetDecisionByIdUseCase,
    private readonly deleteUseCase: DeleteTargetDecisionUseCase,
  ) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const decisions = await this.getAllUseCase.execute();
      res.json(decisions);
    } catch (error) {
      res.status(500).json({ message: 'Error getting decisions', error });
    }
  }

  async getById({ params }: Request<GetTargetDecisionDto>, res: Response): Promise<void> {
    try {
      const decision = await this.getByIdUseCase.execute(params);

      if (!decision) {
        res.status(404).json({ message: 'Decision not found' });
        return;
      }

      res.json(decision);
    } catch (error) {
      res.status(500).json({ message: 'Error getting decision', error });
    }
  }

  async delete({ params }: Request<GetTargetDecisionDto>, res: Response): Promise<void> {
    try {
      await this.deleteUseCase.execute(params);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting decision', error });
    }
  }
}
