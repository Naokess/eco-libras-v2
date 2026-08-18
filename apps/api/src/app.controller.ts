import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { Term } from '@eco-libras/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Health check — usado pelo critério de aceite da Fase 0 e por orquestração/CI
  @Get('/health')
  getHealth() {
    return {
      status: 'ok',
      service: 'eco-libras-api',
      timestamp: new Date().toISOString(),
    };
  }

  // Termo de exemplo validado pelo schema compartilhado do monorepo
  @Get('/term')
  getTerm(): Term {
    return this.appService.getTermExample();
  }
}
