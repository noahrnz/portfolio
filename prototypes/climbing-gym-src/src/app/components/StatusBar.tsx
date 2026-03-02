import { motion } from 'motion/react';
import svgPaths from "../../imports/svg-ld6ebv7med";

export default function StatusBar() {
  return (
    <motion.div 
      className="absolute content-stretch flex items-center justify-between left-0 pt-[6px] px-[20px] right-0 top-0" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="content-stretch flex flex-col items-start relative shrink-0">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white">
          <p className="leading-[16px] whitespace-pre-wrap">9:41</p>
        </div>
      </div>
      
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <div className="relative shrink-0 size-[9px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.p369e6300} fill="white" />
          </svg>
        </div>
        <div className="h-[8px] relative shrink-0 w-[11px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 9.91667">
            <path d={svgPaths.p58eaa40} fill="white" />
          </svg>
        </div>
        <div className="h-[9px] relative shrink-0 w-[5px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.83333 11.6667">
            <path d={svgPaths.pbe2abc0} fill="white" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
