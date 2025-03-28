// src/logging/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ActivityLog } from 'src/entities';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction): void {
    
    req['log'] = new ActivityLog().logStart(req.path,req.method,req);
    
    // Log response when finished
    res.on('finish', async () => {
      let log = req['log'] as ActivityLog ?? null;
      if(log){
        await log.logEnd('success');
      }
      
    });
    
    next();
  }
  

}