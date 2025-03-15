const LoadingSpinner = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-dark bg-opacity-80 z-50">
			<div className="relative">
				{/* Outer ring */}
				<div className="w-16 h-16 rounded-full border-4 border-primary-200 border-opacity-20 animate-spin"></div>
				
				{/* Inner ring */}
				<div className="absolute top-0 left-0 w-16 h-16 rounded-full border-t-4 border-l-4 border-primary-500 animate-spin" style={{ animationDuration: '1s' }}></div>
				
				{/* Center dot */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
			</div>
		</div>
	);
};

export default LoadingSpinner;