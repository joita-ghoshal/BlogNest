import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import FeaturedBlogs from '../components/home/FeaturedBlogs';
import LatestBlogs from '../components/home/LatestBlogs';
import TrendingBlogs from '../components/home/TrendingBlogs';
import PopularCategories from '../components/home/PopularCategories';
import PopularAuthors from '../components/home/PopularAuthors';
import NewsletterSection from '../components/home/NewsletterSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>BlogNest - Discover Ideas & Share Your Story</title>
        <meta name="description" content="Explore thought-provoking articles, share your perspective, and connect with passionate writers on BlogNest." />
      </Helmet>
      <HeroSection />
      <FeaturedBlogs />
      <LatestBlogs />
      <TrendingBlogs />
      <PopularCategories />
      <PopularAuthors />
      <NewsletterSection />
    </>
  );
};

export default Home;
