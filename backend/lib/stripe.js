import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let stripeInstance;

// Check if the Stripe key is defined
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Stripe API key is missing! Please check your .env file");
  // Create a mock Stripe instance or throw a more detailed error
  stripeInstance = {
    customers: { create: () => ({ id: 'mock_customer' }) },
    checkout: { 
      sessions: { 
        create: () => ({ url: 'https://mock-checkout-url.com' }),
        retrieve: () => ({ payment_status: 'paid', metadata: {}, amount_total: 0 })
      } 
    },
    coupons: {
      create: () => ({ id: 'mock_coupon' })
    },
    // Add other Stripe APIs as needed
    isMock: true
  };
  
  console.log("Using mock Stripe implementation");
} else {
  // Use the actual Stripe API with the provided key
  const stripeOptions = {
    apiVersion: '2023-10-16', // Specify a stable API version
  };
  
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, stripeOptions);
  console.log("Stripe initialized successfully");
}

export const stripe = stripeInstance;