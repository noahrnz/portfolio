import { motion } from 'motion/react';
import svgPaths from "../../imports/svg-ld6ebv7med";
import { Class } from "../context/AppContext";
import { useApp } from "../context/AppContext";

interface ClassDetailModalProps {
  classData: Class;
  onClose: () => void;
}

export default function ClassDetailModal({ classData, onClose }: ClassDetailModalProps) {
  const { bookClass, cancelBooking } = useApp();
  
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-[#171717] rounded-t-[32px] z-50 max-w-[448px] mx-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="flex flex-col p-[32px] gap-[24px]">
          <div className="w-[48px] h-[4px] bg-[#27272a] rounded-full mx-auto -mt-[16px]" />
          
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-[8px] flex-1">
              <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[24px] text-white leading-tight">
                {classData.title}
              </h2>
              <div className="font-['Inter:Regular',sans-serif] text-[14px] text-[#71717a] leading-[20px]">
                {classData.time} • {classData.level}
              </div>
              <div className="font-['Inter:Semi_Bold',sans-serif] text-[12px] text-[#ff6b35] leading-[16px]">
                {classData.date}
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-[#27272a] hover:bg-[#3f3f46] rounded-full p-[8px] transition-colors"
            >
              <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                <path d="M15 5L5 15M5 5L15 15" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="bg-[#27272a] rounded-[12px] p-[12px]">
                <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p176f0bb4} fill="#ff6b35" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white">
                  {classData.location}
                </span>
                <span className="font-['Inter:Regular',sans-serif] text-[12px] text-[#71717a]">
                  {classData.location === "Mission Cliffs" ? "2295 Harrison St, San Francisco" : "2573 3rd St, San Francisco"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-[12px]">
              <div className="bg-[#27272a] rounded-[12px] p-[12px]">
                <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="#ff6b35" strokeWidth="2" />
                  <path d="M10 6V10L13 13" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white">
                  60 minutes
                </span>
                <span className="font-['Inter:Regular',sans-serif] text-[12px] text-[#71717a]">
                  Class duration
                </span>
              </div>
            </div>

            <div className="flex items-center gap-[12px]">
              <div className="bg-[#27272a] rounded-[12px] p-[12px]">
                <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                  <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="#ff6b35" strokeWidth="2" />
                  <path d="M3 17C3 14.2386 5.68629 12 9 12H11C14.3137 12 17 14.2386 17 17" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white">
                  {classData.instructor}
                </span>
                <span className="font-['Inter:Regular',sans-serif] text-[12px] text-[#71717a]">
                  Instructor
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white uppercase tracking-[0.6px]">
              About This Class
            </h3>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#a1a1aa] leading-[22px]">
              {classData.level === "Beginner" && "Perfect for those new to climbing. Learn basic techniques, safety, and build confidence on the wall."}
              {classData.level === "Advanced" && "Advanced techniques and challenging problems for experienced climbers looking to push their limits."}
              {classData.level === "Intermediate" && "Take your climbing to the next level with advanced techniques and rope management."}
              {classData.level === "All Levels" && "A relaxing yoga session designed specifically for climbers to improve flexibility and prevent injuries."}
            </p>
          </div>

          {classData.isBooked ? (
            <button
              onClick={() => {
                cancelBooking(classData.id);
                onClose();
              }}
              className="bg-[#27272a] hover:bg-[#3f3f46] py-[16px] rounded-[12px] transition-colors"
            >
              <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[12px] text-white tracking-[0.5px] uppercase">
                Cancel Booking
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                bookClass(classData.id);
                onClose();
              }}
              className="bg-[#ff6b35] hover:bg-[#ff8555] py-[16px] rounded-[12px] transition-colors"
            >
              <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[12px] text-black tracking-[0.5px] uppercase">
                Book This Class
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
