import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogMiddlewareMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'tidak diketahui';
    const startTime = Date.now();

    // jika sudah finish
    res.on('finish', () => {
      // status code berhasil atau tidak
      const { statusCode } = res;

      //durasi
      const duration = Date.now() - startTime;

      // tentukan pesannya
      const LogMessage = `
      [
        ${method}
        ${originalUrl}
        --
        Status : ${statusCode}
        --
        Durasi : ${duration} ms
        --
        Ip Address : ${ip}
        --
        Agent : ${userAgent}
      ]`

      if(statusCode >= 500){
        this.logger.error(LogMessage);
      }else if(statusCode >= 400){
        this.logger.warn(LogMessage)
      }else{
        this.logger.log(LogMessage)
      }
    });

    next();
  }
}
