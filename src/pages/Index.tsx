import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import ProblemsSection from '@/components/landing/ProblemsSection';
import SolutionSection from '@/components/landing/SolutionSection';
import OutputsSection from '@/components/landing/OutputsSection';
import UsersSection from '@/components/landing/UsersSection';
import CTASection from '@/components/landing/CTASection';
import { useEffect } from 'react';
import { initializeLanguage } from '@/i18n';

const Index = () => {
  // Initialize language on component mount
  useEffect(() => {
    initializeLanguage();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemsSection />
        <SolutionSection />
        <OutputsSection />
        <UsersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
