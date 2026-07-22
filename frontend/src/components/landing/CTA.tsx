import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12"
      >
        <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">
          Tem algo parado que podia ajudar outro estudante?
        </h2>
        <p className="max-w-lg text-primary-foreground/90">
          Leva menos de 2 minutos para anunciar. Doação ou venda, você escolhe.
        </p>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate('/cadastro')}
          className="bg-white text-primary hover:bg-white/90"
        >
          Criar minha conta
        </Button>
      </motion.div>
    </section>
  );
}
