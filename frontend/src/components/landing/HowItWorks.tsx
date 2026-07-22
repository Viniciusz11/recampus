import { motion } from 'framer-motion';
import { PackagePlus, Search, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: Sparkles,
    title: 'Crie sua conta',
    description: 'Cadastro rápido com seu e-mail para começar a anunciar ou buscar itens.',
  },
  {
    icon: PackagePlus,
    title: 'Anuncie ou busque',
    description:
      'Publique o que você quer doar ou vender, ou filtre por categoria para achar o que precisa.',
  },
  {
    icon: Search,
    title: 'Combine a troca',
    description: 'Encontrou o item? Combine diretamente com o anunciante pelos dados do perfil.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Como funciona</h2>
          <p className="mt-3 text-muted-foreground">Três passos entre a gaveta parada e o próximo dono.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                Passo {index + 1}
              </span>
              <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
