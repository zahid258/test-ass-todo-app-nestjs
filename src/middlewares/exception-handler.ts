// src/logging/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ActivityLog } from 'src/entities';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal Server Error',
    };
    
    const logContext = request['log'] as ActivityLog ?? null;
    if(logContext){
      await logContext.logEnd('error', JSON.stringify(errorResponse));
    }
    
    response.status(status).json(errorResponse);
  }

}