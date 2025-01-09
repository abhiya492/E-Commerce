# 🛍️ Modern E-Commerce Platform

A cutting-edge, feature-rich e-commerce solution built with the MERN stack 

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication with Access/Refresh tokens
- Role-based authorization (Admin/User)
- Secure password hashing
- Protected API routes

### 🏪 Product Management
- 📦 Advanced product categorization
- 🏷️ Dynamic pricing system
- 🔍 Smart search functionality
- 📸 Multi-image product support
- 🏷️ Product variants (size, color, etc.)

### 🛒 Shopping Experience
- Real-time cart updates
- Wishlist functionality
- Product reviews & ratings
- Order tracking system
- Recently viewed items

### 💳 Payment & Checkout
- 💰 Stripe payment integration
- 🔒 Secure checkout process
- 📜 Order confirmation emails
- 🎫 Coupon system
- 💱 Multiple currency support

### 📊 Admin Dashboard
- 📈 Sales analytics
- 📦 Inventory management
- 👥 Customer management
- 📊 Revenue reports
- 🎯 Marketing tools

### 🎨 User Interface
- 📱 Fully responsive design
- 🌓 Dark/Light mode
- ⚡ Fast loading times
- 🌈 Customizable themes
- 🎭 Animated transitions

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js 
- 🎨 Tailwind CSS
- 📱 React Router
- 🔄 Redux Toolkit
- 📊 Recharts

### Backend
- 🚀 Node.js
- ⚡ Express.js
- 🍃 MongoDB
- 🔄 Redis
- 💳 Stripe

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- MongoDB
- Redis
- Stripe Account

### Installation

1. Clone the repository
```bash
git clone https://github.com/abhiya492/E-Commerce.git
```

2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🔑 Environment Variables

### Backend `.env`
```env
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
STRIPE_SECRET_KEY=your_stripe_secret
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`
```env
VITE_API_URL=backend_url
VITE_STRIPE_PUBLIC_KEY=stripe_public_key
```

## 📝 API Documentation

### Auth Routes
- 🔑 `POST /api/auth/register` - User registration
- 🔑 `POST /api/auth/login` - User login
- 🔑 `POST /api/auth/refresh` - Refresh token

### Product Routes
- 📦 `GET /api/products` - Get all products
- 📦 `POST /api/products` - Create product (Admin)
- 📦 `PUT /api/products/:id` - Update product (Admin)
- 📦 `DELETE /api/products/:id` - Delete product (Admin)

### Order Routes
- 🛍️ `POST /api/orders` - Create order
- 🛍️ `GET /api/orders` - Get user orders
- 🛍️ `GET /api/orders/:id` - Get order details

## 💻 Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Quality
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks
- TypeScript for type safety

## 🔥 Performance Optimizations

- ⚡ Redis caching for frequent queries
- 🖼️ Image optimization
- 🚀 Code splitting
- 📦 Bundle optimization
- 🔄 API response caching

## 🔒 Security Features

- 🛡️ CORS configuration
- 🔐 XSS protection
- 🚫 Rate limiting
- 🔒 CSRF protection
- 📝 Security headers

## 📱 Mobile Responsiveness

- 📲 Fluid layouts
- 🖥️ Breakpoint optimization
- 📱 Touch-friendly interfaces
- 🌅 Optimized images
- ⚡ Fast mobile performance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 💖 Acknowledgments

- 🙏 Thanks to all contributors
- 📚 Built with open-source libraries
- 🌟 Inspired by modern e-commerce needs

---
Built with 💝 for the modern web
