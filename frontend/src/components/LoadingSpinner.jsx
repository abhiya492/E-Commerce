import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <motion.div
        className='relative'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />
        <div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
        <div className='sr-only'>Loading</div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
