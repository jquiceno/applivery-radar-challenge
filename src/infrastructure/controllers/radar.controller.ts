import { Request, Response } from 'express';
import { DecideTargetUseCase } from '@application/use-cases';
import { DecideTargetDto } from '@application/dtos/decide-target.dto';

export class DecideTargetController {
  constructor(private readonly useCase: DecideTargetUseCase) {}

  async execute({ body: dto }: Request<any, any, DecideTargetDto>, res: Response): Promise<void> {
    try {
      const result = await this.useCase.execute(dto);
      res.json(result.target);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}
