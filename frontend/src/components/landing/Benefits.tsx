import { motion } from 'framer-motion';
import { HandHeart, Leaf, ShieldCheck, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Wallet,
    title: 'Economia real',
    description:
      'Calculadora, jaleco e livros costumam custar caro comprados novos. Encontre por muito menos - ou de graça.',
  },
  {
    icon: Leaf,
    title: 'Menos desperdício',
    description: 'Um material que sairia de circulação continua sendo útil para o próximo estudante.',
  },
  {
    icon: HandHeart,
    title: 'Ajuda quem está chegando',
    description: 'Calouros e bolsistas encontram materiais essenciais sem pesar no orçamento do início do curso.',
  },
  {
    icon: ShieldCheck,
    title: 'Feito para o campus',
    description: 'Anúncios só entre pessoas da sua comunidade acadêmica - mais confiança na hora da troca.',
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Por que usar o ReCampus?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Uma plataforma pensada para o dia a dia universitário, não um marketplace genérico.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="rounded-xl border border-border bg-background p-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <benefit.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-foreground">{benefit.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
