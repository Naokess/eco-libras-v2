import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /health', () => {
    it('deve retornar status ok', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('eco-libras-api');
    });
  });

  describe('GET /term', () => {
    it('deve retornar o termo de exemplo validado pelo shared', () => {
      const result = appController.getTerm();
      expect(result).toEqual({
        term: 'Libras',
        slug: 'libras',
        definition: 'Língua Brasileira de Sinais.',
      });
    });
  });
});
