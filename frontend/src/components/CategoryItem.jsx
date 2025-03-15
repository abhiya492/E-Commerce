import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const CategoryItem = ({ category }) => {
	const { href, name, imageUrl } = category;

	return (
		<Link 
			to={href}
			className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
		>
			<div className="aspect-w-3 aspect-h-4 w-full overflow-hidden rounded-xl bg-dark-50">
				<img 
					src={imageUrl} 
					alt={name} 
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60"></div>
				<div className="absolute inset-0 bg-dark-900 opacity-0 transition-opacity duration-300 group-hover:opacity-40"></div>
			</div>
			<div className="absolute inset-0 flex flex-col justify-end p-6">
				<h3 className="font-heading text-xl font-bold text-white">{name}</h3>
				<div className="mt-2 flex items-center text-sm text-primary-400 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
					<span className="mr-2">Shop now</span>
					<ArrowRight size={16} />
				</div>
			</div>
		</Link>
	);
};

CategoryItem.propTypes = {
	category: PropTypes.shape({
		href: PropTypes.string.isRequired,
		imageUrl: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
};

export default CategoryItem;