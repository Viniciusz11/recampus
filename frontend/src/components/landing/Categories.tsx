import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/types/ad';
import { CATEGORY_META } from '@/utils/adMeta';

export function Categories() {
  return (
    <section id="categorias" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Categorias</h2>
        <p className="mt-3 text-muted-foreground">
          Do livro de Cálculo I ao jaleco do primeiro semestre de laboratório.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CATEGORIES.map((category, index) => {
          const meta = CATEGORY_META[category];
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/anuncios?category=${category}`}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <meta.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{meta.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
