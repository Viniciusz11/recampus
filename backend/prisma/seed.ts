import { PrismaClient, Category, AdType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'senha123';

interface DemoAd {
  title: string;
  description: string;
  category: Category;
  type: AdType;
  price: number | null;
  imageSeed: string;
}

const demoAds: DemoAd[] = [
  {
    title: 'Cálculo I - James Stewart (7ª edição)',
    description: 'Usado por um semestre, sem rasuras. Ótimo para quem está começando Engenharia ou ADS.',
    category: Category.BOOKS,
    type: AdType.SALE,
    price: 45,
    imageSeed: 'calculo-stewart',
  },
  {
    title: 'Calculadora científica HP 12C',
    description: 'Funcionando perfeitamente, pilhas novas. Ideal para Economia e Administração.',
    category: Category.CALCULATORS,
    type: AdType.SALE,
    price: 120,
    imageSeed: 'hp-12c',
  },
  {
    title: 'Jaleco branco tamanho M',
    description: 'Usado só nas aulas práticas do primeiro ano. Lavado e passado, doando para quem precisa.',
    category: Category.LAB_COATS,
    type: AdType.DONATION,
    price: null,
    imageSeed: 'jaleco-m',
  },
  {
    title: 'Kit Arduino Uno + sensores',
    description: 'Kit completo usado no projeto de sistemas embarcados: Arduino, protoboard, jumpers e 6 sensores.',
    category: Category.ELECTRONICS,
    type: AdType.SALE,
    price: 80,
    imageSeed: 'arduino-kit',
  },
  {
    title: 'Mesa de escritório compacta',
    description: 'Mesa 1m x 0,5m, bom estado. Preciso desocupar o apê até o fim do mês.',
    category: Category.FURNITURE,
    type: AdType.DONATION,
    price: null,
    imageSeed: 'mesa-escritorio',
  },
  {
    title: 'Apostila xerocada de Cálculo Numérico',
    description: 'Apostila completa do semestre passado, com todos os exercícios resolvidos a lápis.',
    category: Category.PHOTOCOPIES,
    type: AdType.DONATION,
    price: null,
    imageSeed: 'apostila-calculo',
  },
  {
    title: 'Kit de vidraria para laboratório de química',
    description: 'Béqueres, provetas e erlenmeyers usados em Química Geral. Todos sem trincas.',
    category: Category.LAB_MATERIALS,
    type: AdType.SALE,
    price: 60,
    imageSeed: 'vidraria-lab',
  },
  {
    title: 'Cadeira de escritório giratória',
    description: 'Confortável, com regulagem de altura. Pequeno desgaste no braço direito.',
    category: Category.FURNITURE,
    type: AdType.SALE,
    price: 90,
    imageSeed: 'cadeira-escritorio',
  },
  {
    title: 'Calculadora Casio fx-991',
    description: 'Calculadora científica básica, ótima para quem está no primeiro semestre. Doando.',
    category: Category.CALCULATORS,
    type: AdType.DONATION,
    price: null,
    imageSeed: 'casio-fx991',
  },
  {
    title: 'Componentes eletrônicos avulsos',
    description: 'Resistores, capacitores, LEDs e alguns transistores sobrando de projetos de Eletrônica.',
    category: Category.ELECTRONICS,
    type: AdType.SALE,
    price: 25,
    imageSeed: 'componentes-avulsos',
  },
];

function imageUrlFor(seed: string): string {
  return `https://picsum.photos/seed/${seed}/640/480`;
}

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const ana = await prisma.user.upsert({
    where: { email: 'ana@recampus.dev' },
    update: { phone: '85999990001' },
    create: {
      name: 'Ana Souza',
      email: 'ana@recampus.dev',
      passwordHash,
      phone: '85999990001',
    },
  });

  const bruno = await prisma.user.upsert({
    where: { email: 'bruno@recampus.dev' },
    update: { phone: '85999990002' },
    create: {
      name: 'Bruno Lima',
      email: 'bruno@recampus.dev',
      passwordHash,
      phone: '85999990002',
    },
  });

  // Seed idempotente: em vez de inventar IDs fixos, apaga só os anúncios
  // destes 2 usuários demo e recria - seguro de rodar quantas vezes quiser
  // em dev sem acumular duplicatas nem afetar dados de outros usuários.
  await prisma.ad.deleteMany({
    where: { ownerId: { in: [ana.id, bruno.id] } },
  });

  await prisma.ad.createMany({
    data: demoAds.map((ad, index) => ({
      title: ad.title,
      description: ad.description,
      category: ad.category,
      type: ad.type,
      price: ad.price,
      imageUrl: imageUrlFor(ad.imageSeed),
      ownerId: index % 2 === 0 ? ana.id : bruno.id,
    })),
  });

  console.log(`Seed concluído: 2 usuários, ${demoAds.length} anúncios.`);
  console.log(`Login de teste: ana@recampus.dev / bruno@recampus.dev - senha "${DEMO_PASSWORD}"`);
}

main()
  .catch((error: unknown) => {
    console.error('Erro ao rodar o seed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
