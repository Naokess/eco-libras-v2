import { z } from "zod";

// Schema de exemplo: define o formato mínimo de um Termo do glossário.
// Este schema será importado tanto pela API (validação) quanto pelo front (formulário).
export const TermSchema = z.object({
  term: z.string().min(1),
  slug: z.string().min(1),
  definition: z.string().min(1),
});

// O tipo derivado do schema — o "Formato" que TS enxerga
export type Term = z.infer<typeof TermSchema>;

// Versão aberta (para criação/edição, campos opcionais)
export const TermInputSchema = TermSchema.partial();
export type TermInput = z.infer<typeof TermInputSchema>;
