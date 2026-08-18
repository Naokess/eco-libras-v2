import { Injectable } from '@nestjs/common';
import { TermSchema, type Term } from '@eco-libras/shared';

@Injectable()
export class AppService {
  // Valida um termo de exemplo usando o schema compartilhado do monorepo.
  getTermExample(): Term {
    const candidate = {
      term: 'Libras',
      slug: 'libras',
      definition: 'Língua Brasileira de Sinais.',
    };
    return TermSchema.parse(candidate); // parse valida e retorna tipado
  }
}
