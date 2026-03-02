import { motion } from 'motion/react';
import { useState } from 'react';
import svgPaths from "../../imports/svg-ld6ebv7med";
import { useApp, Class } from "../context/AppContext";
import ClassDetailModal from "../components/ClassDetailModal";

function BookedClassCard({ classData, onClick }: { classData: Class; onClick: () => void }) {
  const { cancelBooking } = useApp();
  
  return (
    <motion.div 
      className="bg-[#171717] content-stretch flex flex-col gap-[10px] p-[16px] relative rounded-[18px] shrink-0 w-full cursor-pointer" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(39,39,42,0.5)] border-solid inset-0 pointer-events-none rounded-[18px]" />
      
      <div className="flex items-start justify-between gap-[8px]">
        <div className="flex flex-col gap-[3px] flex-1 min-w-0">
          <div className="flex items-start gap-[6px]">
            <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-white leading-[20px] line-clamp-2 shrink-0 flex-1">
              {classData.title}
            </h3>
            <div className="bg-[rgba(255,107,53,0.1)] flex items-center gap-[4px] px-[7px] py-[2.5px] rounded-[4px] shrink-0">
              <svg className="size-[11px]" fill="none" viewBox="0 0 18 20">
                <path d={svgPaths.pd0beb00} fill="#ff6b35" />
              </svg>
              <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[9px] text-[#ff6b35] tracking-[0.5px] uppercase">
                Confirmed
              </span>
            </div>
          </div>
          
          <div className="font-['Inter:Semi_Bold',sans-serif] text-[13px] text-[#ff6b35] leading-[17px]">
            {classData.date}
          </div>
          
          <div className="flex items-center gap-[6px] mt-[2px] flex-wrap">
            <div className="flex items-center gap-[4px]">
              <svg className="size-[12px]" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#71717a" strokeWidth="2" />
                <path d="M10 6V10L13 13" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-['Inter:Regular',sans-serif] text-[12px] text-[#a1a1aa]">
                {classData.time}
              </span>
            </div>
            
            <div className="bg-[#3f3f46] rounded-[9999px] shrink-0 size-[2px]" />
            
            <div className="flex items-center gap-[4px]">
              <svg className="size-[12px]" fill="none" viewBox="0 0 20 20">
                <path d={svgPaths.p176f0bb4} fill="#71717a" />
              </svg>
              <span className="font-['Inter:Regular',sans-serif] text-[12px] text-[#a1a1aa]">
                {classData.location}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-[4px] mt-[1px]">
            <svg className="size-[12px]" fill="none" viewBox="0 0 20 20">
              <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="#71717a" strokeWidth="2" />
              <path d="M3 17C3 14.2386 5.68629 12 9 12H11C14.3137 12 17 14.2386 17 17" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-['Inter:Regular',sans-serif] text-[12px] text-[#a1a1aa]">
              {classData.instructor}
            </span>
          </div>
        </div>
      </div>

      <button 
        className="bg-[#27272a] hover:bg-[#3f3f46] py-[9px] rounded-[8px] transition-colors mt-[4px]"
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to cancel this booking?')) {
            cancelBooking(classData.id);
          }
        }}
      >
        <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[11px] text-white tracking-[0.5px] uppercase">
          Cancel Booking
        </span>
      </button>
    </motion.div>
  );
}

export default function BookingsPage() {
  const { getBookedClasses } = useApp();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const bookedClasses = getBookedClasses();
  
  // Mock past bookings data
  const pastBookings: Class[] = [
    {
      id: 101,
      title: "Intro to Lead Climbing",
      instructor: "Tommy Caldwell",
      time: "Yesterday, 6:00 PM",
      duration: "2 hours",
      difficulty: "Intermediate",
      location: "Mission Cliffs",
      spots: "15",
      description: "Learn the fundamentals of lead climbing including clipping techniques, fall practice, and belaying a leader.",
      isBooked: true
    },
    {
      id: 102,
      title: "Advanced Bouldering",
      instructor: "Alex Puccio",
      time: "Mar 28, 7:00 PM",
      duration: "90 min",
      difficulty: "Advanced",
      location: "Dogpatch Boulders",
      spots: "12",
      description: "Push your limits with advanced bouldering problems and technique refinement.",
      isBooked: true
    },
    {
      id: 103,
      title: "Yoga for Climbers",
      instructor: "Sarah Lopez",
      time: "Mar 25, 5:30 PM",
      duration: "60 min",
      difficulty: "All Levels",
      location: "Mission Cliffs",
      spots: "20",
      description: "Improve flexibility and prevent injuries with yoga specifically designed for climbers.",
      isBooked: true
    },
    {
      id: "104",
      title: "Strength for Climbers",
      instructor: "Matt Fultz",
      time: "Mar 22, 6:00 PM",
      date: "Fri, Mar 22",
      level: "Intermediate",
      duration: "75 min",
      difficulty: "Intermediate",
      location: "Dogpatch Boulders",
      spots: "18",
      description: "Build finger and core strength with exercises tailored for climbers.",
      isBooked: true
    }
  ];

  return (
    <>
      <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
        {bookedClasses.length === 0 && pastBookings.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center w-full py-[80px] gap-[16px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-[#171717] rounded-full p-[24px]">
              <svg className="size-[48px]" fill="none" viewBox="0 0 18 20">
                <path d={svgPaths.pd0beb00} fill="#3f3f46" />
              </svg>
            </div>
            <div className="flex flex-col gap-[8px] items-center">
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] text-white">
                No bookings yet
              </h3>
              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#71717a] text-center max-w-[280px]">
                Book a class from the home screen to see your upcoming sessions here
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {bookedClasses.length > 0 && (
              <div className="flex flex-col gap-[10px] w-full">
                <motion.h2
                  className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#a1a1aa] uppercase tracking-[0.6px] px-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Upcoming
                </motion.h2>
                <div className="flex flex-col gap-[10px] w-full">
                  {bookedClasses.map((classItem, index) => (
                    <motion.div
                      key={classItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <BookedClassCard 
                        classData={classItem}
                        onClick={() => setSelectedClass(classItem)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {pastBookings.length > 0 && (
                <div className="flex flex-col gap-[10px] w-full pb-[28px]">
                <motion.div
                  className="flex items-center gap-[12px] w-full px-[4px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#a1a1aa] uppercase tracking-[0.6px]">
                    Past Classes
                  </h2>
                  <div className="flex-1 h-[1px] bg-[#27272a]" />
                </motion.div>
                <div className="flex flex-col gap-[10px] w-full">
                  {pastBookings.map((classItem, index) => (
                    <motion.div
                      key={classItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="opacity-60"
                    >
                      <BookedClassCard 
                        classData={classItem}
                        onClick={() => setSelectedClass(classItem)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
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