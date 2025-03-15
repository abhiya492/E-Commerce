import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	error: null,
	isLoading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully");
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Failed to create product";
			set({ loading: false, error: errorMessage });
			toast.error(errorMessage);
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true, isLoading: true, error: null });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false, isLoading: false });
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Failed to fetch products";
			set({ error: errorMessage, loading: false, isLoading: false });
			toast.error(errorMessage);
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true, isLoading: true, error: null });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false, isLoading: false });
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Failed to fetch products";
			set({ error: errorMessage, loading: false, isLoading: false });
			toast.error(errorMessage);
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true, error: null });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully");
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Failed to delete product";
			set({ loading: false, error: errorMessage });
			toast.error(errorMessage);
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Failed to update product";
			set({ loading: false, error: errorMessage });
			toast.error(errorMessage);
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true, isLoading: true, error: null });
		try {
			const response = await axios.get("/products/featured");
			// If the server returns null or undefined, default to an empty array
			const featuredProducts = response.data || [];
			set({ products: featuredProducts, loading: false, isLoading: false });
			return featuredProducts;
		} catch (error) {
			console.error("Error fetching featured products:", error);
			const errorMessage = error.response?.data?.message || "Failed to fetch featured products";
			set({ error: errorMessage, loading: false, isLoading: false, products: [] });
			// Only show a toast error if it's an actual API error, not a connection issue
			if (error.response) {
				toast.error(errorMessage);
			}
			return [];
		}
	},
}));
