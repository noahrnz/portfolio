import { motion } from 'motion/react';
import { useState } from 'react';
import svgPaths from "../../imports/svg-ld6ebv7med";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  delay: number;
}

function SettingItem({ icon, label, value, onClick, delay }: SettingItemProps) {
  return (
    <motion.div
      className="bg-[#171717] flex items-center justify-between p-[20px] rounded-[16px] w-full cursor-pointer hover:bg-[#1f1f1f] transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-[16px]">
        <div className="bg-[#27272a] rounded-[12px] p-[10px]">
          {icon}
        </div>
        <span className="font-['Inter:Semi_Bold',sans-serif] text-[15px] text-white">
          {label}
        </span>
      </div>
      {value && (
        <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[#71717a]">
          {value}
        </span>
      )}
      <svg className="size-[16px] ml-[8px]" fill="none" viewBox="0 0 20 20">
        <path d="M7 4L13 10L7 16" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      className="bg-[#171717] flex flex-col items-center justify-center p-[24px] rounded-[20px] flex-1"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="font-['Inter:Bold',sans-serif] font-bold text-[32px] text-[#ff6b35] leading-tight">
        {value}
      </div>
      <div className="font-['Inter:Regular',sans-serif] text-[13px] text-[#a1a1aa] mt-[4px] uppercase tracking-[0.5px]">
        {label}
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full pb-[32px]">
        <motion.div
          className="flex flex-col items-center w-full gap-[16px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-full size-[100px] flex items-center justify-center">
            <span className="font-['Inter:Bold',sans-serif] font-bold text-[40px] text-black">
              AH
            </span>
          </div>
          <div className="flex flex-col items-center gap-[4px]">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[28px] text-white leading-tight">
              Alex Honnold
            </h1>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#a1a1aa]">
              alex.honnold@touchstone.com
            </p>
            <div className="bg-[rgba(255,107,53,0.1)] flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] mt-[8px]">
              <motion.div 
                className="bg-[#ff6b35] rounded-[9999px] shrink-0 size-[6px]" 
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
              <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[10px] text-[#ff6b35] tracking-[0.5px] uppercase">
                Active Member
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-[12px] w-full">
          <StatCard label="Classes" value="47" delay={0.4} />
          <StatCard label="Hours" value="82" delay={0.5} />
        </div>

        <div className="flex flex-col gap-[12px] w-full">
          <motion.h2
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white uppercase tracking-[0.6px] px-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Account Settings
          </motion.h2>
          
          <SettingItem
            icon={
              <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="#ff6b35" strokeWidth="2" />
                <path d="M3 17C3 14.2386 5.68629 12 9 12H11C14.3137 12 17 14.2386 17 17" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            label="Edit Profile"
            delay={0.7}
          />
          
          <SettingItem
            icon={
              <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                <path d={svgPaths.p176f0bb4} fill="#ff6b35" />
              </svg>
            }
            label="Home Location"
            value="Mission Cliffs"
            delay={0.75}
          />
          
          <SettingItem
            icon={
              <svg className="size-[18px]" fill="none" viewBox="0 0 18 20">
                <path d={svgPaths.pd0beb00} fill="#ff6b35" />
              </svg>
            }
            label="Membership Plan"
            value="Unlimited"
            delay={0.8}
          />
          
          <SettingItem
            icon={
              <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                <rect x="3" y="4" width="14" height="13" rx="2" stroke="#ff6b35" strokeWidth="2" />
                <path d="M3 8H17" stroke="#ff6b35" strokeWidth="2" />
                <path d="M7 12H7.01" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            label="Payment Method"
            value="•••• 4242"
            delay={0.85}
          />
        </div>

        <div className="flex flex-col gap-[12px] w-full mt-[8px]">
          <motion.h2
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white uppercase tracking-[0.6px] px-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Preferences
          </motion.h2>
          
          <SettingItem
            icon={
              <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                <path d="M15 6L9 12L5 8" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Notifications"
            delay={0.95}
          />
          
          <SettingItem
            icon={
              <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="7" stroke="#ff6b35" strokeWidth="2" />
                <path d="M10 6V10H14" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            label="Reminder Settings"
            delay={1.0}
          />
        </div>

        <motion.button
          className="bg-[#27272a] hover:bg-[#3f3f46] py-[16px] rounded-[12px] transition-colors w-full mt-[16px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogout(true)}
        >
          <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[12px] text-white tracking-[0.5px] uppercase">
            Sign Out
          </span>
        </motion.button>

        <motion.div
          className="text-center w-full mt-[16px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#71717a]">
            Version 2.4.1 • Member since 2024
          </p>
        </motion.div>
      </div>

      {showLogout && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogout(false)}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#171717] rounded-[24px] p-[32px] z-50 max-w-[360px] w-[90%]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-white text-center mb-[12px]">
              Sign Out?
            </h3>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#a1a1aa] text-center mb-[24px]">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-[12px]">
              <button
                className="bg-[#27272a] hover:bg-[#3f3f46] py-[14px] rounded-[12px] transition-colors flex-1"
                onClick={() => setShowLogout(false)}
              >
                <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[11px] text-white tracking-[0.5px] uppercase">
                  Cancel
                </span>
              </button>
              <button
                className="bg-[#ff6b35] hover:bg-[#ff8555] py-[14px] rounded-[12px] transition-colors flex-1"
                onClick={() => {
                  // Handle sign out
                  setShowLogout(false);
                }}
              >
                <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[11px] text-black tracking-[0.5px] uppercase">
                  Sign Out
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}