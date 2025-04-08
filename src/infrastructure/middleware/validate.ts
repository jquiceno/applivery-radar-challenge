// infrastructure/middleware/validate.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const instance = plainToInstance(dtoClass, body);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map((err) => {
          return {
            property: err.property,
            constraints: err.constraints,
            children: err.children,
          };
        }),
      });
    }

    req.body = instance;
    return next();
  };
}
