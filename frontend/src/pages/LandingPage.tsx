import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Benefits } from '@/components/landing/Benefits';
import { Categories } from '@/components/landing/Categories';
import { CTA } from '@/components/landing/CTA';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LatestAdsShowcase } from '@/components/landing/LatestAdsShowcase';
import { Stats } from '@/components/landing/Stats';

export function LandingPage() {
  const { hash } = useLocation();

  // Rola até a seção correspondente quando a página monta (ou o hash muda)
  // com uma âncora na URL - React Router não faz isso sozinho, diferente de
  // uma navegação de página cheia do navegador.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <>
      <Hero />
      <Stats />
      <Benefits />
      <HowItWorks />
      <Categories />
      <LatestAdsShowcase />
      <CTA />
    </>
  );
}
