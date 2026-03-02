import { Link, useLocation } from "react-router";
import { motion } from 'motion/react';
import svgPaths from "../../imports/svg-ld6ebv7med";

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <motion.div 
      className="absolute bg-[#0a0a0a] bottom-0 content-stretch flex items-center justify-between left-0 pb-[28px] pt-[12px] px-[24px] right-0" 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
    >
      <Link to="/">
        <motion.div 
          className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative shrink-0 size-[20px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <path d={svgPaths.p2cd8680} fill={isActive('/') ? "#ff6b35" : "#A1A1AA"} />
            </svg>
          </div>
        </motion.div>
      </Link>
      
      <Link to="/locations">
        <motion.div 
          className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative shrink-0 size-[20px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p176f0bb4} fill={isActive('/locations') ? "#ff6b35" : "#A1A1AA"} />
            </svg>
          </div>
        </motion.div>
      </Link>
      
      <Link to="/bookings">
        <motion.div 
          className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="h-[20px] relative shrink-0 w-[18px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
              <path d={svgPaths.pd0beb00} fill={isActive('/bookings') ? "#ffffff" : "#71717a"} />
            </svg>
          </div>
        </motion.div>
      </Link>
      
      <Link to="/profile">
        <motion.div 
          className="content-stretch flex items-center justify-center relative shrink-0 cursor-pointer" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative shrink-0 size-[18px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p85bff00} fill={isActive('/profile') ? "#ff6b35" : "#A1A1AA"} />
            </svg>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
