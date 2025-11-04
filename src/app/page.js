'use client'

import LandingHeader from '@/components/Landing/LandingHeader';
import HeroSection from '@/components/Landing/HeroSection/HeroSection';
import FeaturesSection from '@/components/Landing/FeaturesSection/FeaturesSection';
import BenefitsSection from '@/components/Landing/BenefitsSection/BenefitsSection';
import HowItWorksSection from '@/components/Landing/HowItWorksSection/HowItWorksSection';
import CTASection from '@/components/Landing/CTASection/CTASection';
import Footer from '@/components/common/Footer';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.landingPage}>
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

