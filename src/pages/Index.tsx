
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/home/FeaturesSection';
import DemoSection from '@/components/home/DemoSection';
import PopularTopicsSection from '@/components/home/PopularTopicsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <DemoSection />
      <PopularTopicsSection />
      <Footer />
    </div>
  );
};

export default Index;
