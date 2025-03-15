import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'

import { useEffect } from 'react'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import { useCartStore } from "./stores/useCartStore";
import { useUserStore } from "./stores/useUserStore";
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import ApiMonitor from './components/ApiMonitor'

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <ErrorBoundary componentName="Application" showHomeButton={false}>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-dark-50 to-dark font-sans text-white">
        {/* Background elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-dark via-dark-50 to-dark opacity-80"></div>
          
          {/* Animated gradient blobs */}
          <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-secondary-500/20 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
              <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
              <Route path='/secret-dashboard' element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />} />
              <Route path='/category/:category' element={<CategoryPage />} />
              <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
              <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
              <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
            </Routes>
          </main>
          
          <Footer />
        </div>

        {/* API Status Monitor */}
        <ApiMonitor />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1E293B',
              color: '#fff',
              border: '1px solid #3bcb98',
            },
            success: {
              iconTheme: {
                primary: '#3bcb98',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
