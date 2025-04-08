import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { radarRouter, targetDecisionRouter } from './infrastructure/routes';

export default function app(port: string, cb: () => void) {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/radar', radarRouter);
  app.use('/audit', targetDecisionRouter);

  // Basic route
  app.get('/', (_req: Request, res: Response) => {
    console.log('YVH radar');
    res.json({ message: 'YVH radar' });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'not found' });
  });

  // Error handling middleware
  app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
    console.error(err.stack);
    next(err);
  });

  // Error response handler
  app.use((_err: Error, _req: Request, res: Response) => {
    res.status(500).json({ message: 'Something went wrong!' });
  });

  app.listen(port, cb);
}
