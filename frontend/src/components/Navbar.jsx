import { useState, useEffect } from 'react';
import { ShoppingCart, UserPlus, LogIn, LogOut, Menu, X, Search, Lock, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const categories = [
	{ name: "Jeans", href: "/category/jeans" },
	{ name: "T-shirts", href: "/category/t-shirts" },
	{ name: "Shoes", href: "/category/shoes" },
	{ name: "Glasses", href: "/category/glasses" },
	{ name: "Jackets", href: "/category/jackets" },
];

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { user, logout } = useUserStore();
	const { cart } = useCartStore();
	const location = useLocation();
	const isAdmin = user?.role === "admin";
	
	// Close mobile menu when changing routes
	useEffect(() => {
		setIsOpen(false);
	}, [location]);
	
	// Add scroll effect
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header 
			className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
				scrolled 
					? 'bg-dark-100/95 backdrop-blur-md shadow-lg' 
					: 'bg-transparent'
			}`}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0 flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<svg 
								className="w-8 h-8" 
								viewBox="0 0 32 32" 
								fill="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="32" height="32" rx="8" fill="#1cad7c"/>
								<path 
									d="M22.5 10.5H9.5C8.675 10.5 8 11.175 8 12V23C8 23.825 8.675 24.5 9.5 24.5H22.5C23.325 24.5 24 23.825 24 23V12C24 11.175 23.325 10.5 22.5 10.5Z" 
									stroke="white" 
									strokeWidth="2" 
									strokeLinecap="round" 
									strokeLinejoin="round"
								/>
								<path 
									d="M19 10.5V9C19 8.60218 18.842 8.22064 18.5607 7.93934C18.2794 7.65804 17.8978 7.5 17.5 7.5H14.5C14.1022 7.5 13.7206 7.65804 13.4393 7.93934C13.158 8.22064 13 8.60218 13 9V10.5" 
									stroke="white" 
									strokeWidth="2" 
									strokeLinecap="round" 
									strokeLinejoin="round"
								/>
							</svg>
							<span className="text-2xl font-bold text-primary-400 hidden sm:block">ModernShop</span>
						</Link>
					</div>
					
					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link 
							to="/" 
							className="text-gray-300 hover:text-primary-400 font-medium text-sm"
						>
							Home
						</Link>
						
						{/* Categories dropdown */}
						<div className="relative">
							<button 
								type="button"
								className="group text-gray-300 hover:text-primary-400 font-medium text-sm flex items-center"
								onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
							>
								Categories
								<ChevronDown 
									size={16} 
									className={`ml-1 transition-transform duration-200 ${
										categoryMenuOpen ? 'rotate-180' : ''
									}`} 
								/>
							</button>
							
							{categoryMenuOpen && (
								<div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-dark-100 ring-1 ring-black ring-opacity-5 py-1 z-50">
									{categories.map((category) => (
										<Link
											key={category.name}
											to={category.href}
											className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-200 hover:text-primary-400"
											onClick={() => setCategoryMenuOpen(false)}
										>
											{category.name}
										</Link>
									))}
								</div>
							)}
						</div>
						
						<Link 
							to="/about" 
							className="text-gray-300 hover:text-primary-400 font-medium text-sm"
						>
							About
						</Link>
						
						<Link 
							to="/contact" 
							className="text-gray-300 hover:text-primary-400 font-medium text-sm"
						>
							Contact
						</Link>
					</nav>
					
					{/* Desktop User Actions */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Search button */}
						<button 
							type="button" 
							className="text-gray-300 hover:text-primary-400"
							aria-label="Search"
						>
							<Search size={20} />
						</button>
						
						{/* Cart */}
						{user && (
							<Link
								to="/cart"
								className="relative group text-gray-300 hover:text-primary-400 transition duration-200"
								aria-label="Cart"
							>
								<ShoppingCart size={20} />
								{cart.length > 0 && (
									<span
										className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						
						{/* Admin Dashboard */}
						{isAdmin && (
							<Link
								to="/secret-dashboard"
								className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
							>
								<Lock size={14} className="mr-1" />
								<span>Admin</span>
							</Link>
						)}
						
						{/* Authentication */}
						{user ? (
							<button
								onClick={logout}
								className="inline-flex items-center px-3.5 py-1.5 border border-gray-700 text-xs font-medium rounded-full text-gray-300 bg-transparent hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
							>
								<LogOut size={14} className="mr-1" />
								Log Out
							</button>
						) : (
							<div className="flex items-center space-x-2">
								<Link
									to="/login"
									className="inline-flex items-center px-3.5 py-1.5 border border-gray-700 text-xs font-medium rounded-full text-gray-300 bg-transparent hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								>
									<LogIn size={14} className="mr-1" />
									Log In
								</Link>
								<Link
									to="/signup"
									className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								>
									<UserPlus size={14} className="mr-1" />
									Sign Up
								</Link>
							</div>
						)}
					</div>
					
					{/* Mobile menu button */}
					<div className="flex md:hidden">
						<button
							type="button"
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
							aria-expanded="false"
							onClick={() => setIsOpen(!isOpen)}
						>
							<span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
							{isOpen ? (
								<X className="block h-6 w-6" aria-hidden="true" />
							) : (
								<Menu className="block h-6 w-6" aria-hidden="true" />
							)}
						</button>
					</div>
				</div>
			</div>
			
			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden bg-dark-100 shadow-lg">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<Link
							to="/"
							className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
						>
							Home
						</Link>
						
						{/* Categories dropdown for mobile */}
						<div className="block px-3 py-2 text-base font-medium text-white">
							<button 
								type="button"
								className="flex w-full items-center text-white"
								onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
							>
								Categories
								<ChevronDown 
									size={16} 
									className={`ml-1 transition-transform duration-200 ${
										categoryMenuOpen ? 'rotate-180' : ''
									}`} 
								/>
							</button>
							
							{categoryMenuOpen && (
								<div className="pl-4 pt-2 space-y-1">
									{categories.map((category) => (
										<Link
											key={category.name}
											to={category.href}
											className="block py-2 text-sm text-gray-300 hover:text-primary-400"
										>
											{category.name}
										</Link>
									))}
								</div>
							)}
						</div>
						
						<Link
							to="/about"
							className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
						>
							About
						</Link>
						
						<Link
							to="/contact"
							className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
						>
							Contact
						</Link>
					</div>
					
					{/* Mobile user actions */}
					<div className="pt-4 pb-3 border-t border-dark-200">
						{user ? (
							<div className="space-y-1">
								{/* Cart */}
								<Link
									to="/cart"
									className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
								>
									<ShoppingCart className="mr-3 h-5 w-5" />
									Cart
									{cart.length > 0 && (
										<span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{cart.length}
										</span>
									)}
								</Link>
								
								{/* Admin Dashboard */}
								{isAdmin && (
									<Link
										to="/secret-dashboard"
										className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
									>
										<Lock className="mr-3 h-5 w-5" />
										Admin Dashboard
									</Link>
								)}
								
								{/* Logout */}
								<button
									onClick={logout}
									className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
								>
									<LogOut className="mr-3 h-5 w-5" />
									Log Out
								</button>
							</div>
						) : (
							<div className="space-y-1">
								<Link
									to="/login"
									className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
								>
									<LogIn className="mr-3 h-5 w-5" />
									Log In
								</Link>
								<Link
									to="/signup"
									className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-dark-200"
								>
									<UserPlus className="mr-3 h-5 w-5" />
									Sign Up
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default Navbar;