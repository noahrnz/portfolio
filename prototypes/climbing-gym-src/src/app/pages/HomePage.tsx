import { motion } from 'motion/react';
import { useState } from 'react';
import svgPaths from "../../imports/svg-ld6ebv7med";
import { useApp, Class } from "../context/AppContext";
import ClassDetailModal from "../components/ClassDetailModal";

function QRCodeCard() {
  const [showQR, setShowQR] = useState(false);
  
  return (
    <>
      <motion.div 
        className="bg-white max-w-[220px] relative rounded-[18px] shadow-[0px_0px_28px_0px_rgba(255,107,53,0.12)] shrink-0 w-full cursor-pointer" 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
        onClick={() => setShowQR(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-row items-center justify-center max-w-[inherit] size-full">
          <div className="content-stretch flex items-center justify-center max-w-[inherit] p-[14px] relative w-full">
            <motion.div 
              className="flex flex-row items-center justify-center self-stretch h-[180px] w-[180px]"
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="h-full overflow-clip relative shrink-0 w-[180px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 252 252">
                  <path d={svgPaths.p38673a80} fill="white" />
                </svg>
                <div className="absolute inset-[10%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 201.6 201.6">
                    <path d={svgPaths.p14f8d8c0} fill="black" />
                  </svg>
                </div>
                <div className="absolute inset-[20%_60%_60%_20%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50.4 50.4">
                    <path d={svgPaths.p119e9200} fill="black" />
                  </svg>
                </div>
                <div className="absolute bottom-[65%] left-1/4 right-[65%] top-1/4">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.2 25.2">
                    <path d={svgPaths.p20c12ec0} fill="white" />
                  </svg>
                </div>
                <div className="absolute inset-[28%_68%_68%_28%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.08 10.08">
                    <path d={svgPaths.p1822b00} fill="black" />
                  </svg>
                </div>
                <div className="absolute inset-[20%_20%_60%_60%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50.4 50.4">
                    <path d={svgPaths.p119e9200} fill="black" />
                  </svg>
                </div>
                <div className="absolute bottom-[65%] left-[65%] right-1/4 top-1/4">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.2 25.2">
                    <path d={svgPaths.p20c12ec0} fill="white" />
                  </svg>
                </div>
                <div className="absolute inset-[28%_28%_68%_68%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.08 10.08">
                    <path d={svgPaths.p1822b00} fill="black" />
                  </svg>
                </div>
                <div className="absolute inset-[60%_60%_20%_20%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50.4 50.4">
                    <path d={svgPaths.p119e9200} fill="black" />
                  </svg>
                </div>
                <div className="absolute bottom-1/4 left-1/4 right-[65%] top-[65%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.2 25.2">
                    <path d={svgPaths.p20c12ec0} fill="white" />
                  </svg>
                </div>
                <div className="absolute inset-[68%_68%_28%_28%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.08 10.08">
                    <path d={svgPaths.p1822b00} fill="black" />
                  </svg>
                </div>
                <div className="absolute inset-[20%_30%_30%_20%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 126">
                    <path d={svgPaths.pc259100} fill="black" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bg-[#ff6b35] bottom-[-10px] content-stretch flex flex-col items-start left-1/2 -translate-x-1/2 px-[10px] py-[3px] rounded-[9999px]" 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            >
              <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_8px_12px_-2px_rgba(0,0,0,0.08)]" />
              <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[10px] justify-center leading-[0] not-italic relative shrink-0 text-[7px] text-black tracking-[0.5px] uppercase">
                <p className="leading-[10px] whitespace-nowrap">scan to enter</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {showQR && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-white rounded-[24px] p-[24px] relative">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-[12px] right-[12px] bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-full p-[6px] transition-colors"
              >
                <svg className="size-[16px]" fill="none" viewBox="0 0 20 20">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <div className="h-[260px] w-[260px]">
                <svg className="size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 252 252">
                  <path d={svgPaths.p38673a80} fill="white" stroke="black" strokeWidth="1" />
                </svg>
                <div className="absolute inset-[10%_10%_10%_10%] top-[40px] left-[40px] right-[40px] bottom-[40px]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 201.6 201.6">
                    <path d={svgPaths.p14f8d8c0} fill="black" />
                  </svg>
                </div>
              </div>
              <p className="text-center mt-[12px] font-['Inter:Semi_Bold',sans-serif] text-[12px] text-[#27272a]">
                Member ID: AH-2024-1850
              </p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

function UserProfile() {
  const { getBookedClasses } = useApp();
  const bookedCount = getBookedClasses().length;
  
  return (
    <motion.div 
      className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full max-w-[200px] z-[1]" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
    >
      <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-tight not-italic relative shrink-0 text-[18px] text-center text-white">
          <p className="leading-tight whitespace-pre-wrap">Alex Honnold</p>
        </div>
      </div>
      
      <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0 w-full">
        <div className="content-stretch flex flex-col items-center relative shrink-0">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#a1a1aa] text-[12px] text-center">
            <p className="leading-[16px] whitespace-pre-wrap">Mission Cliffs</p>
          </div>
        </div>
        
        <div className="bg-[#3f3f46] rounded-[9999px] shrink-0 size-[3px]" />
        
        <div className="bg-[rgba(255,107,53,0.1)] content-stretch flex gap-[4px] items-center px-[8px] py-[3px] relative rounded-[5px] shrink-0">
          <motion.div 
            className="bg-[#ff6b35] rounded-[9999px] shrink-0 size-[5px]" 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="content-stretch flex flex-col items-center relative shrink-0">
            <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff6b35] text-[9px] text-center tracking-[0.5px] uppercase whitespace-nowrap">
              <p className="leading-[12px] whitespace-nowrap">Active Member</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClassCard({ classData, delay, onClick }: { classData: Class; delay: number; onClick: () => void }) {
  const { bookClass } = useApp();
  
  return (
    <motion.div 
      className="bg-[#171717] content-stretch flex flex-col gap-[8px] p-[14px] relative rounded-[16px] shrink-0 w-full cursor-pointer" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      layout
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(39,39,42,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <div className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white leading-[18px]">
            {classData.title}
          </div>
          <div className="font-['Inter:Regular',sans-serif] text-[11px] text-[#71717a] leading-[14px]">
            {classData.time} • {classData.level}
          </div>
        </div>
        
        {classData.isBooked ? (
          <div 
            className="bg-[rgba(255,107,53,0.1)] flex items-center gap-[4px] px-[10px] py-[6px] rounded-[6px] min-w-[72px] justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="size-[12px]" fill="none" viewBox="0 0 18 20">
              <path d={svgPaths.pd0beb00} fill="#ff6b35" />
            </svg>
            <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[9px] text-[#ff6b35] tracking-[0.5px] uppercase whitespace-nowrap">
              Booked
            </span>
          </div>
        ) : (
          <motion.button 
            className="bg-[#27272a] hover:bg-[#3f3f46] px-[12px] py-[6px] rounded-[6px] transition-colors min-w-[72px] justify-center flex"
            onClick={(e) => {
              e.stopPropagation();
              bookClass(classData.id);
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[9px] text-white tracking-[0.5px] uppercase">
              Book
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { classes } = useApp();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Sort classes: booked first
  const sortedClasses = [...classes].sort((a, b) => {
    if (a.isBooked && !b.isBooked) return -1;
    if (!a.isBooked && b.isBooked) return 1;
    return 0;
  });
  
  const hasBookedClasses = classes.some(cls => cls.isBooked);
  
  return (
    <>
      <div className="content-stretch flex flex-col isolate items-center relative shrink-0 w-full">
        <div className="content-stretch flex flex-col items-start max-w-[220px] pb-[24px] relative shrink-0 w-full z-[2]">
          <QRCodeCard />
        </div>
        <UserProfile />
      </div>
      
      <div className="content-stretch flex flex-col gap-[8px] items-start pt-[20px] pb-[16px] relative shrink-0 w-full">
        <div className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white tracking-[0.5px] uppercase px-[2px]">
          Available Classes
        </div>
        
        {sortedClasses.map((classItem, index) => {
          const isLastBookedClass = classItem.isBooked && 
            (index === sortedClasses.length - 1 || !sortedClasses[index + 1]?.isBooked);
          
          return (
            <motion.div 
              key={classItem.id} 
              className="w-full"
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <ClassCard 
                classData={classItem}
                delay={1 + index * 0.1}
                onClick={() => setSelectedClass(classItem)}
              />
              
              {hasBookedClasses && isLastBookedClass && (
                <motion.div 
                  className="w-full h-[1px] bg-[#27272a] my-[8px]" 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {selectedClass && (
        <ClassDetailModal
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </>
  );
}