/**
 * Seed inicial do ECO-Libras (Fase 0)
 * Popula: admin padrão + 7 cursos + 6 categorias + ~10 termos de exemplo.
 *
 * Idempotente: usa upsert, pode rodar quantas vezes quiser sem duplicar.
 * Uso (da raiz do monorepo, onde está o .env):
 *   npx prisma db seed --schema apps/api/prisma/schema.prisma
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/** Gera uma senha forte aleatória de 16 chars (letras, números e símbolos). */
function generatePassword(length = 16): string {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
  const randomBytesResult = randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[randomBytesResult[i] % chars.length];
  }
  return password;
}

const COURSES = [
  {
    slug: 'ciencias-biologicas',
    name: 'Ciências Biológicas',
    description:
      'Biologia, anatomia e meio ambiente — vocabulário de ciências naturais em Libras.',
    order: 1,
  },
  {
    slug: 'direito',
    name: 'Direito',
    description:
      'Termos jurídicos e do sistema legal traduzidos para a Libras.',
    order: 2,
  },
  {
    slug: 'psicologia',
    name: 'Psicologia',
    description: 'Saúde mental, comportamento e emoções na língua de sinais.',
    order: 3,
  },
  {
    slug: 'ciencia-da-computacao',
    name: 'Ciência da Computação',
    description: 'Programação, internet e tecnologia com sinais específicos.',
    order: 4,
  },
  {
    slug: 'engenharia-civil',
    name: 'Engenharia Civil',
    description:
      'Construção, obras e infraestrutura no universo da engenharia.',
    order: 5,
  },
  {
    slug: 'pedagogia',
    name: 'Pedagogia',
    description:
      'Educação, ensino e aprendizagem em contexto escolar bilíngue.',
    order: 6,
  },
  {
    slug: 'medicina-veterinaria',
    name: 'Medicina Veterinária',
    description: 'Animais, clínica veterinária e saúde animal em Libras.',
    order: 7,
  },
];

const CATEGORIES = [
  { slug: 'saudacoes', name: 'Saudações', order: 1 },
  { slug: 'familia', name: 'Família', order: 2 },
  { slug: 'trabalho', name: 'Trabalho', order: 3 },
  { slug: 'educacao', name: 'Educação', order: 4 },
  { slug: 'tempo', name: 'Tempo', order: 5 },
  { slug: 'sentimentos', name: 'Sentimentos', order: 6 },
];

const TERMS = [
  {
    term: 'Olá',
    slug: 'ola',
    definition: 'Saudação inicial, equivalente a "Olá" / "Oi" em português.',
    example: 'Olá, como você está?',
    categorySlug: 'saudacoes',
    specialist: 'Prof.ª Ana Lima',
  },
  {
    term: 'Obrigado',
    slug: 'obrigado',
    definition: 'Expressão de gratidão, equivalente a "Obrigado(a)".',
    example: 'Obrigado pela ajuda!',
    categorySlug: 'saudacoes',
    specialist: 'Prof.ª Ana Lima',
  },
  {
    term: 'Família',
    slug: 'familia',
    definition: 'Conjunto de pessoas unidas por laços familiares.',
    example: 'Minha família mora em São Paulo.',
    categorySlug: 'familia',
    courseSlug: 'psicologia',
    specialist: 'Prof. Carlos Mendes',
  },
  {
    term: 'Trabalho',
    slug: 'trabalho',
    definition: 'Atividade profissional ou ocupação remunerada.',
    example: 'Eu trabalho com tecnologia.',
    categorySlug: 'trabalho',
    courseSlug: 'ciencia-da-computacao',
    specialist: 'Prof.ª Beatriz Souza',
  },
  {
    term: 'Escola',
    slug: 'escola',
    definition: 'Instituição de ensino onde ocorre a educação formal.',
    example: 'A escola começa às 7 horas.',
    categorySlug: 'educacao',
    courseSlug: 'pedagogia',
    specialist: 'Prof.ª Débora Reis',
  },
  {
    term: 'Amanhã',
    slug: 'amanha',
    definition: 'O dia seguinte ao de hoje.',
    example: 'Te vejo amanhã!',
    categorySlug: 'tempo',
    specialist: 'Prof. Eduardo Prado',
  },
  {
    term: 'Hoje',
    slug: 'hoje',
    definition: 'O dia atual, o dia em que se está.',
    example: 'Hoje está um dia lindo.',
    categorySlug: 'tempo',
    specialist: 'Prof. Eduardo Prado',
  },
  {
    term: 'Alegria',
    slug: 'alegria',
    definition: 'Sentimento de contentamento e felicidade.',
    example: 'A sua visita me trouxe alegria.',
    categorySlug: 'sentimentos',
    courseSlug: 'psicologia',
    specialist: 'Prof. Carlos Mendes',
  },
  {
    term: 'Célula',
    slug: 'celula',
    definition:
      'Unidade estrutural e funcional básica de todos os seres vivos.',
    example: 'A célula é a menor unidade viva.',
    categorySlug: 'educacao',
    courseSlug: 'ciencias-biologicas',
    specialist: 'Prof.ª Marina Costa',
  },
  {
    term: 'Veterinário',
    slug: 'veterinario',
    definition:
      'Profissional da área de saúde responsável por cuidar de animais.',
    example: 'Levei meu cachorro ao veterinário.',
    categorySlug: 'trabalho',
    courseSlug: 'medicina-veterinaria',
    specialist: 'Prof. Rafael Almeida',
  },
];

async function main() {
  // ---- Admin padrão (idempotente) ----
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@ecolibras.com';
  const adminName = process.env.SEED_ADMIN_NAME ?? 'Administrador';

  // Senha: usa SEED_ADMIN_PASSWORD se existir; senão gera uma forte aleatória.
  const usingGeneratedPassword = !process.env.SEED_ADMIN_PASSWORD;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? generatePassword();

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName, role: 'ADMIN' },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'ADMIN',
    },
  });

  if (!existingAdmin && usingGeneratedPassword) {
    console.log(
      `\n⚠️  ADMIN CRIADO com senha gerada — GUARDE ESTA SENHA:\n` +
        `   email: ${admin.email}\n` +
        `   senha: ${adminPassword}\n` +
        `   (não será mostrada novamente nas próximas execuções)\n`,
    );
  }
  console.log(`✔ Admin: ${admin.email} (${admin.role})`);

  // ---- Cursos ----
  const createdCourses = new Map<string, number>();
  for (const c of COURSES) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        order: c.order,
        isActive: true,
      },
      create: c,
    });
    createdCourses.set(c.slug, course.id);
  }
  console.log(`✔ ${COURSES.length} cursos`);

  // ---- Categorias ----
  const createdCategories = new Map<string, number>();
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
    createdCategories.set(cat.slug, category.id);
  }
  console.log(`✔ ${CATEGORIES.length} categorias`);

  // ---- Termos de exemplo ----
  let termCount = 0;
  for (const t of TERMS) {
    const categoryId = t.categorySlug
      ? (createdCategories.get(t.categorySlug) ?? null)
      : null;
    const courseId = t.courseSlug
      ? (createdCourses.get(t.courseSlug) ?? null)
      : null;

    await prisma.term.upsert({
      where: { slug: t.slug },
      update: {
        term: t.term,
        definition: t.definition,
        example: t.example,
        categoryId,
        courseId,
        specialist: t.specialist,
        status: 'PUBLISHED',
      },
      create: {
        term: t.term,
        slug: t.slug,
        definition: t.definition,
        example: t.example,
        categoryId,
        courseId,
        specialist: t.specialist,
        status: 'PUBLISHED',
      },
    });
    termCount++;
  }
  console.log(`✔ ${termCount} termos de exemplo`);

  console.log('\nSeed concluído com sucesso! ✅');
}

main()
  .catch((e) => {
    console.error('\nErro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
