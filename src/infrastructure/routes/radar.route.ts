import { Router } from 'express';

import { DecideTargetDto } from '@application/dtos/decide-target.dto';
import { DecideTargetUseCase } from '@application/use-cases';

import { validateDto } from '../middleware/validate';
import { DecideTargetController } from '../controllers/radar.controller';
import { ProtocolStrategyFactory } from '@domain/factories';
import { MongooseDecisionRepository } from '../repositories/mongoose-decision.repository';

const protocolStrategyFactory = new ProtocolStrategyFactory();
const targetDecisionRepository = new MongooseDecisionRepository();
const useCase = new DecideTargetUseCase(protocolStrategyFactory, targetDecisionRepository);
const controller = new DecideTargetController(useCase);

export const radarRouter = Router();

radarRouter.post('/', validateDto(DecideTargetDto), controller.execute.bind(controller));
