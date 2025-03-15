import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, ChevronRight, TrendingUp, Heart, Shield, AlertCircle } from "lucide-react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import ErrorBoundary from "../components/ErrorBoundary";
import useApiEffect from "../hooks/useApiEffect";

const categories = [
  { href: "/category/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/category/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/category/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/category/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/category/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/category/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/category/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const features = [
  {
    name: "Trending Styles",
    description: "Stay ahead with our curated collection of the latest fashion trends.",
    icon: TrendingUp,
  },
  {
    name: "Sustainable Materials",
    description: "Eco-friendly products that help reduce environmental impact.",
    icon: Heart,
  },
  {
    name: "Secure Shopping",
    description: "End-to-end encryption ensures your personal data is always protected.",
    icon: Shield,
  },
];

// Featured Products component with error boundary
const FeaturedProductsSection = () => {
  const { fetchFeaturedProducts } = useProductStore();

  const { data: featuredProducts, isLoading, error } = useApiEffect(
    fetchFeaturedProducts,
    [],
    { showErrorToast: false }
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-dark-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full mb-3">Top picks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Loading our handpicked selection of premium items...
            </p>
          </div>
          <div className="p-8 flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 rounded-full bg-dark-200"></div>
              <div className="space-y-4 flex-1 max-w-md">
                <div className="h-4 bg-dark-200 rounded w-3/4"></div>
                <div className="h-4 bg-dark-200 rounded"></div>
                <div className="h-4 bg-dark-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-dark-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="bg-dark-200 p-4 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-primary-400">No Featured Products Available</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-md">
              Check back soon for our featured product selection.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-dark-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full mb-3">Top picks</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Our handpicked selection of premium items chosen for their quality and style
          </p>
        </div>
        
        <FeaturedProducts featuredProducts={featuredProducts} />
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-100 to-dark-50 opacity-60"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="block text-primary-400">Modern Style</span>
                <span className="block">For Modern People</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Discover premium fashion that combines quality, comfort, and sustainable practices. Our exclusive collection is designed for those who value both style and responsibility.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/category/jeans"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-transparent px-6 py-3 text-base font-medium text-white hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-w-5 aspect-h-6 relative overflow-hidden rounded-lg">
                <img
                  src="/hero-image.jpg"
                  alt="People wearing modern clothing"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-48 w-48 rounded-lg overflow-hidden border-4 border-primary-500">
                <img
                  src="/hero-accent-1.jpg"
                  alt="Fashion detail"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-lg overflow-hidden border-4 border-secondary-500">
                <img
                  src="/hero-accent-2.jpg"
                  alt="Fashion detail"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-dark-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.name}
                className="relative rounded-lg bg-dark-50 p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute -top-4 -right-4 bg-primary-500 p-2 rounded-full">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.name}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-400 font-heading">
              Explore Our Categories
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Discover the latest trends in eco-friendly fashion across our diverse collections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/all-categories"
              className="inline-flex items-center text-primary-400 hover:text-primary-300"
            >
              View all categories
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section with Error Boundary */}
      <ErrorBoundary componentName="Featured Products">
        <FeaturedProductsSection />
      </ErrorBoundary>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900 to-primary-900 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Join Our Community
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto">
            Sign up today and get exclusive access to our new arrivals, special offers, and fashion tips
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-md bg-dark-100 border-dark-200 text-white px-4 py-3 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 