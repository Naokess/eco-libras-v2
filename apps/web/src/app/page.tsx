import { TermSchema, type Term } from '@eco-libras/shared';

// Termo de exemplo — será validado pelo schema compartilhado do monorepo.
const example: Term = TermSchema.parse({
  term: 'Libras',
  slug: 'libras',
  definition: 'Língua Brasileira de Sinais.',
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-8 dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        ECO-Libras
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Schema validado pelo <code>@eco-libras/shared</code>:
      </p>
      <pre className="rounded-lg border border-zinc-200 bg-white p-6 text-left font-mono text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        {JSON.stringify(example, null, 2)}
      </pre>
    </main>
  );
}
