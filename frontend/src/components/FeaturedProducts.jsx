import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ featuredProducts = [] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const [isAnimating, setIsAnimating] = useState(false);
	const slideContainerRef = useRef(null);
	
	const { user } = useUserStore();

	// Reset current index when products change
	useEffect(() => {
		setCurrentIndex(0);
	}, [featuredProducts]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Guard against empty array
	if (!featuredProducts || featuredProducts.length === 0) {
		return null;
	}

	const nextSlide = () => {
		if (isAnimating) return;
		
		const maxIndex = featuredProducts.length - itemsPerPage;
		if (currentIndex >= maxIndex) return;
		
		setIsAnimating(true);
		setCurrentIndex(prev => prev + 1);
		setTimeout(() => setIsAnimating(false), 500);
	};

	const prevSlide = () => {
		if (isAnimating || currentIndex === 0) return;
		
		setIsAnimating(true);
		setCurrentIndex(prev => prev - 1);
		setTimeout(() => setIsAnimating(false), 500);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className="py-8">
			<div className="relative">
				<div className="overflow-hidden">
					<div
						ref={slideContainerRef}
						className="flex transition-transform duration-500 ease-in-out"
						style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
					>
						{featuredProducts.map((product) => (
							<div 
								key={product._id} 
								className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3"
							>
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>

				{/* Only show navigation buttons if there are more products than can fit on screen */}
				{featuredProducts.length > itemsPerPage && (
					<>
						<button
							onClick={prevSlide}
							disabled={isStartDisabled}
							className={`absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
								isStartDisabled 
									? "bg-dark-200 text-gray-500 cursor-not-allowed" 
									: "bg-white text-dark hover:bg-primary-50 hover:text-primary-600"
							}`}
							aria-label="Previous slide"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>

						<button
							onClick={nextSlide}
							disabled={isEndDisabled}
							className={`absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
								isEndDisabled 
									? "bg-dark-200 text-gray-500 cursor-not-allowed" 
									: "bg-white text-dark hover:bg-primary-50 hover:text-primary-600"
							}`}
							aria-label="Next slide"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					</>
				)}
				
				{/* Progress indicators - only show if there are enough products */}
				{featuredProducts.length > itemsPerPage && (
					<div className="mt-6 flex justify-center space-x-2">
						{Array.from({ length: Math.min(featuredProducts.length - itemsPerPage + 1, 5) }).map((_, index) => {
							const actualIndex = featuredProducts.length <= 5 
								? index 
								: Math.floor(index * ((featuredProducts.length - itemsPerPage) / 4));
							
							return (
								<button
									key={index}
									onClick={() => {
										if (isAnimating) return;
										setIsAnimating(true);
										setCurrentIndex(actualIndex);
										setTimeout(() => setIsAnimating(false), 500);
									}}
									className={`h-2 w-8 rounded-full transition-all duration-300 ${
										currentIndex === actualIndex ? "bg-primary-500" : "bg-dark-200 hover:bg-primary-300"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default FeaturedProducts;
