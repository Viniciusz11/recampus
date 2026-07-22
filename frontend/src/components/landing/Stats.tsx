import { motion } from 'framer-motion';

// Estatísticas simuladas do sistema, como pedido no edital - ilustram a
// proposta de valor sem depender de um endpoint de analytics real.
const STATS = [
  { label: 'Itens reaproveitados', value: '1.240+' },
  { label: 'Estudantes participando', value: '820+' },
  { label: 'Economizado em compras', value: 'R$ 96 mil' },
  { label: 'Categorias diferentes', value: '8' },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
