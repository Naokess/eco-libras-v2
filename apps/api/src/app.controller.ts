import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { Term } from '@eco-libras/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/term')
  getTerm(): Term {
    return this.appService.getTermExample();
  }
}
