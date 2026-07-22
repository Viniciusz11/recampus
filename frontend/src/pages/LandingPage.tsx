import { Benefits } from '@/components/landing/Benefits';
import { Categories } from '@/components/landing/Categories';
import { CTA } from '@/components/landing/CTA';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LatestAdsShowcase } from '@/components/landing/LatestAdsShowcase';
import { Stats } from '@/components/landing/Stats';

export function LandingPage() {
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
