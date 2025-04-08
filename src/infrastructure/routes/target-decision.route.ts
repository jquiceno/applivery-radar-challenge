import { Router } from 'express';
import { TargetDecisionController } from '../controllers/target-decision.controller';
import { validateDto } from '../middleware/validate';
import { GetTargetDecisionDto } from '@application/dtos/get-target-decision.dto';
import { GetAllTargetDecisionsUseCase } from '@application/use-cases/get-all-target-decisions.usecase';
import { GetTargetDecisionByIdUseCase } from '@application/use-cases/get-target-decision-by-id.usecase';
import { DeleteTargetDecisionUseCase } from '@application/use-cases/delete-target-decision.usecase';
import { MongooseDecisionRepository } from '../repositories/mongoose-decision.repository';

export const targetDecisionRouter = Router();

const repository = new MongooseDecisionRepository();
const controller = new TargetDecisionController(
  new GetAllTargetDecisionsUseCase(repository),
  new GetTargetDecisionByIdUseCase(repository),
  new DeleteTargetDecisionUseCase(repository),
);

targetDecisionRouter.get('/', controller.getAll.bind(controller));
targetDecisionRouter.get(
  '/:id',
  validateDto(GetTargetDecisionDto),
  controller.getById.bind(controller),
);
targetDecisionRouter.delete(
  '/:id',
  validateDto(GetTargetDecisionDto),
  controller.delete.bind(controller),
);
