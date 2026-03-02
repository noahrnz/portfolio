import { Outlet, useLocation } from "react-router";
import { motion } from 'motion/react';
import svgPaths from "../../imports/svg-ld6ebv7med";
import Navigation from "../components/Navigation";
import StatusBar from "../components/StatusBar";
import { AppProvider } from "../context/AppContext";

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const getPageTitle = () => {
    if (location.pathname === '/locations') return 'Locations';
    if (location.pathname === '/bookings') return 'My Bookings';
    if (location.pathname === '/profile') return 'Profile';
    return '';
  };
  
  return (
    <div className="absolute content-stretch flex items-end justify-between left-0 pb-[10px] pt-[20px] px-[20px] right-0 top-[20px]" data-name="Header">
      {isHomePage ? (
        <>
          <motion.div 
            className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[26px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff6b35] text-[20px] tracking-[0.5px] uppercase">
                <p className="leading-[26px] whitespace-pre-wrap">TOUCHSTONE</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1aa] text-[10px] tracking-[1px] uppercase">
                <p className="leading-[14px] whitespace-pre-wrap">{`Climbing & Fitness`}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-[#171717] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="h-[16px] relative shrink-0 w-[13px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
                <path d={svgPaths.p164b49c0} fill="#A1A1AA" />
              </svg>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="flex items-center justify-center w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[18px] text-white">
            {getPageTitle()}
          </h1>
        </motion.div>
      )}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <AppProvider>
      <div className="bg-[#0a0a0a] content-stretch flex flex-col items-start relative size-full">
        <div className="h-[700px] max-w-[380px] min-h-[700px] overflow-clip relative shrink-0 w-full">
          <Header />
          
          <div className={`absolute bottom-[72px] content-stretch flex flex-col items-center left-0 overflow-y-auto px-[20px] right-0 ${isHomePage ? 'top-[100px] py-[24px]' : 'top-[80px] py-[12px]'}`}>
            <Outlet />
          </div>
          
          <Navigation />
          
          <motion.div 
            className="-translate-x-1/2 absolute bg-[#27272a] bottom-[6px] h-[4px] left-1/2 rounded-[9999px] w-[100px]" 
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 1.6 }}
          />
          
          <StatusBar />
        </div>
      </div>
    </AppProvider>
  );
}