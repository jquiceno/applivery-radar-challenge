import { Request, Response, NextFunction } from 'express';
import { validateDto } from '@infrastructure/middleware/validate';
import { IsString, IsNotEmpty } from 'class-validator';

// Test DTO class
class TestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

describe('validateDto middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should pass validation with valid body data', async () => {
    mockRequest.body = { name: 'test' };
    const middleware = validateDto(TestDto, 'body');

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should pass validation with valid params data', async () => {
    mockRequest.params = { name: 'test' };
    const middleware = validateDto(TestDto, 'params');

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should fail validation with invalid data', async () => {
    mockRequest.body = { name: '' };
    const middleware = validateDto(TestDto, 'body');

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: 'name',
            constraints: expect.any(Object),
          }),
        ]),
      }),
    );
  });

  it('should fail validation with missing required property', async () => {
    mockRequest.body = {};
    const middleware = validateDto(TestDto, 'body');

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: 'name',
            constraints: expect.any(Object),
          }),
        ]),
      }),
    );
  });

  it('should fail validation with wrong data type', async () => {
    mockRequest.body = { name: 123 };
    const middleware = validateDto(TestDto, 'body');

    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: 'name',
            constraints: expect.any(Object),
          }),
        ]),
      }),
    );
  });
});
