import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
	  console.log("Request body received:", req.body);
  
	  const { name, description, price, image, category } = req.body;
  
	  if (!name || !description || !price || !category) {
		return res.status(400).json({ message: "Missing required fields" });
	  }
  
	  console.log("Valid input received. Preparing to upload image...");
  
	  let cloudinaryResponse = null;
	  if (image) {
		try {
		  cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		  console.log("Image uploaded successfully:", cloudinaryResponse.secure_url);
		} catch (cloudinaryError) {
		  console.log("Cloudinary upload error:", cloudinaryError.message);
		  return res.status(500).json({ message: "Cloudinary upload failed", error: cloudinaryError.message });
		}
	  }
  
	  console.log("Creating product in the database...");
	  const product = await Product.create({
		name,
		description,
		price,
		image: cloudinaryResponse?.secure_url || "",
		category,
	  });
  
	  console.log("Product created successfully:", product);
	  res.status(201).json(product);
	} catch (error) {
	  console.log("Error in createProduct controller:", error.stack || error.message);
	  res.status(500).json({ message: "Server error occurred", error: error.message });
	}
  };
  

  export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
  

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}

// Add at least 4 products in each category (jeans, t-shirts, shoes, glasses, jackets, suits, bags)
const initialProducts = [
	// Jeans
	{ name: "Blue Jeans", description: "Comfortable blue jeans", price: 49.99, image: "", category: "jeans" },
	{ name: "Black Jeans", description: "Stylish black jeans", price: 59.99, image: "", category: "jeans" },
	{ name: "Skinny Jeans", description: "Trendy skinny jeans", price: 69.99, image: "", category: "jeans" },
	{ name: "Ripped Jeans", description: "Fashionable ripped jeans", price: 79.99, image: "", category: "jeans" },
	// T-shirts
	{ name: "White T-shirt", description: "Classic white t-shirt", price: 19.99, image: "", category: "t-shirts" },
	{ name: "Black T-shirt", description: "Basic black t-shirt", price: 19.99, image: "", category: "t-shirts" },
	{ name: "Graphic T-shirt", description: "Cool graphic t-shirt", price: 29.99, image: "", category: "t-shirts" },
	{ name: "V-neck T-shirt", description: "Stylish v-neck t-shirt", price: 24.99, image: "", category: "t-shirts" },
	// Shoes
	{ name: "Running Shoes", description: "Comfortable running shoes", price: 89.99, image: "", category: "shoes" },
	{ name: "Casual Shoes", description: "Stylish casual shoes", price: 79.99, image: "", category: "shoes" },
	{ name: "Formal Shoes", description: "Elegant formal shoes", price: 99.99, image: "", category: "shoes" },
	{ name: "Sneakers", description: "Trendy sneakers", price: 69.99, image: "", category: "shoes" },
	// Glasses
	{ name: "Sunglasses", description: "Cool sunglasses", price: 49.99, image: "", category: "glasses" },
	{ name: "Reading Glasses", description: "Comfortable reading glasses", price: 39.99, image: "", category: "glasses" },
	{ name: "Blue Light Glasses", description: "Protective blue light glasses", price: 59.99, image: "", category: "glasses" },
	{ name: "Aviator Glasses", description: "Stylish aviator glasses", price: 69.99, image: "", category: "glasses" },
	// Jackets
	{ name: "Leather Jacket", description: "Classic leather jacket", price: 199.99, image: "", category: "jackets" },
	{ name: "Denim Jacket", description: "Trendy denim jacket", price: 99.99, image: "", category: "jackets" },
	{ name: "Bomber Jacket", description: "Stylish bomber jacket", price: 149.99, image: "", category: "jackets" },
	{ name: "Winter Jacket", description: "Warm winter jacket", price: 249.99, image: "", category: "jackets" },
	// Suits
	{ name: "Business Suit", description: "Elegant business suit", price: 299.99, image: "", category: "suits" },
	{ name: "Casual Suit", description: "Stylish casual suit", price: 199.99, image: "", category: "suits" },
	{ name: "Wedding Suit", description: "Classic wedding suit", price: 399.99, image: "", category: "suits" },
	{ name: "Tuxedo", description: "Formal tuxedo", price: 499.99, image: "", category: "suits" },
	// Bags
	{ name: "Backpack", description: "Durable backpack", price: 59.99, image: "", category: "bags" },
	{ name: "Handbag", description: "Stylish handbag", price: 79.99, image: "", category: "bags" },
	{ name: "Laptop Bag", description: "Protective laptop bag", price: 99.99, image: "", category: "bags" },
	{ name: "Travel Bag", description: "Spacious travel bag", price: 129.99, image: "", category: "bags" },
];

// Function to add initial products to the database
export const addInitialProducts = async () => {
	try {
		for (const product of initialProducts) {
			await Product.create(product);
		}
		console.log("Initial products added successfully");
	} catch (error) {
		console.log("Error adding initial products:", error.message);
	}
};

// Call the function to add initial products
addInitialProducts();
