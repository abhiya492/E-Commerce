/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Heart, Eye, Check } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	
	const handleAddToCart = async () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		
		setIsAddingToCart(true);
		try {
			await addToCart(product);
			toast.success("Added to cart!");
		} catch (error) {
			toast.error("Failed to add to cart");
		} finally {
			setIsAddingToCart(false);
		}
	};

	return (
		<div 
			className="group relative flex flex-col overflow-hidden rounded-lg bg-dark-50 shadow-md hover:shadow-xl transition-all duration-300"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Product image */}
			<div className="aspect-w-3 aspect-h-4 relative overflow-hidden bg-dark-100">
				<img 
					src={product.image || 'https://via.placeholder.com/300x400?text=No+Image'} 
					alt={product.name}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				
				{/* Overlay */}
				<div className="absolute inset-0 bg-dark-900/20 transition-opacity group-hover:opacity-100 opacity-0"></div>
				
				{/* Quick action buttons */}
				<div className="absolute top-4 right-4 space-y-2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
					<button 
						className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
						aria-label="Add to wishlist"
					>
						<Heart size={18} className="text-dark-900 hover:text-primary-600" />
					</button>
					<button 
						className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
						aria-label="Quick view"
					>
						<Eye size={18} className="text-dark-900 hover:text-primary-600" />
					</button>
				</div>
				
				{/* Price tag */}
				<div className="absolute top-4 left-4">
					<div className="rounded-full bg-primary-600 px-3 py-1.5 text-sm font-medium text-white shadow-md">
						${product.price.toFixed(2)}
					</div>
				</div>
			</div>
			
			{/* Product info */}
			<div className="flex flex-1 flex-col p-4">
				<h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
					{product.name}
				</h3>
				<p className="mt-1 text-sm text-gray-400 line-clamp-2">
					{product.description}
				</p>
				
				<div className="mt-auto pt-4">
					<button
						className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center ${
							isAddingToCart
								? "bg-primary-700 text-white"
								: "bg-primary-600 text-white hover:bg-primary-700"
						}`}
						onClick={handleAddToCart}
						disabled={isAddingToCart}
					>
						{isAddingToCart ? (
							<>
								<Check size={18} className="mr-2 animate-pulse" />
								Added!
							</>
						) : (
							<>
								<ShoppingCart size={18} className="mr-2" />
								Add to Cart
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;