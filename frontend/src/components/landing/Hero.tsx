import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground"
        >
          Economize e circule no campus
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        >
          Desapega o que você já usou. <span className="text-primary">Ajuda quem está começando.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg text-muted-foreground"
        >
          O ReCampus conecta estudantes para doar ou vender livros, calculadoras, jalecos e
          materiais de estudo — em vez de deixar tudo parado numa gaveta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" onClick={() => navigate('/cadastro')}>
            Anunciar um item
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/anuncios')}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar itens
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
