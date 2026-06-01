import HeroSlider      from '@/components/home/heroSlidebar';
import NewArrivals     from '@/components/home/NewArrivals';
import SaleBanner  from '@/components/home/SaleBanner';
import Tsp from '@/components/home/tsp';
import FeaturesBar from '@/components/home/FeaturesBar';
import BlogSection from '@/components/home/BlogSection';
import InstagramSection from '@/components/home/InstagramSection';

export default function HomePage() {
  return (  
    <>
      {/* 1. Full-screen hero with auto-sliding images */}
      <HeroSlider />
      {/* 2. New Arrivals section with 4 products in a grid */}
      <NewArrivals />
      {/* 3. Sale banner with countdown timer */}
      <SaleBanner />
      {/* 4. Top Selling Products section with 1 large card + 4 small cards */}
      <Tsp />
      {/* 5. Features bar with 3 feature cards */}
      <FeaturesBar />
      {/* 6. Blog section with 3 latest posts */}
      <BlogSection />
      {/* 7. Instagram feed with 6 images in a grid */}
      <InstagramSection />
    </>
  );
}