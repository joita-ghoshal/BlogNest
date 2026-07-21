import { Helmet } from "react-helmet-async";
import HeroSection from "../components/home/HeroSection";
import FeaturedBlogs from "../components/home/FeaturedBlogs";
import LatestBlogs from "../components/home/LatestBlogs";
import TrendingBlogs from "../components/home/TrendingBlogs";
import PopularCategories from "../components/home/PopularCategories";
import PopularAuthors from "../components/home/PopularAuthors";
import NewsletterSection from "../components/home/NewsletterSection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>BlogNest - Discover Ideas & Share Your Story</title>
        <meta
          name="description"
          content="Explore a world of knowledge, inspiration, and creativity. Read thought-provoking articles and join our community of passionate writers."
        />
      </Helmet>

      <main>
        <HeroSection />
        <FeaturedBlogs />
        <LatestBlogs />
        <TrendingBlogs />
        <PopularCategories />
        <PopularAuthors />
        <NewsletterSection />
      </main>
    </>
  );
}
