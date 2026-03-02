import { motion } from 'motion/react';
import svgPaths from "../../imports/svg-ld6ebv7med";

interface LocationCardProps {
  name: string;
  address: string;
  distance: string;
  amenities: string[];
  hours: string;
  delay: number;
}

function LocationCard({ name, address, distance, amenities, hours, delay }: LocationCardProps) {
  return (
    <motion.div 
      className="bg-[#171717] content-stretch flex flex-col gap-[16px] p-[24px] relative rounded-[24px] shrink-0 w-full" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(39,39,42,0.5)] border-solid inset-0 pointer-events-none rounded-[24px]" />
      
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[8px] flex-1">
          <div className="font-['Inter:Bold',sans-serif] font-bold text-[20px] text-white leading-[26px]">
            {name}
          </div>
          <div className="font-['Inter:Regular',sans-serif] text-[14px] text-[#a1a1aa] leading-[20px]">
            {address}
          </div>
          <div className="flex items-center gap-[6px] mt-[4px]">
            <svg className="size-[14px]" fill="none" viewBox="0 0 20 20">
              <path d={svgPaths.p176f0bb4} fill="#ff6b35" />
            </svg>
            <span className="font-['Inter:Semi_Bold',sans-serif] text-[12px] text-[#ff6b35]">
              {distance}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <svg className="size-[16px]" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="#71717a" strokeWidth="2" />
            <path d="M10 6V10L13 13" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-['Inter:Regular',sans-serif] text-[13px] text-[#a1a1aa]">
            {hours}
          </span>
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {amenities.map((amenity, i) => (
            <div 
              key={i}
              className="bg-[#27272a] px-[10px] py-[6px] rounded-[6px]"
            >
              <span className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[#a1a1aa] uppercase tracking-[0.5px]">
                {amenity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="bg-[#27272a] hover:bg-[#3f3f46] py-[12px] rounded-[10px] transition-colors mt-[8px]">
        <span className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[11px] text-white tracking-[0.5px] uppercase">
          Get Directions
        </span>
      </button>
    </motion.div>
  );
}

export default function LocationsPage() {
  const locations = [
    {
      name: "Mission Cliffs",
      address: "2295 Harrison St, San Francisco, CA 94110",
      distance: "0.3 miles away",
      hours: "Mon-Fri: 6am-11pm, Sat-Sun: 8am-9pm",
      amenities: ["Bouldering", "Top Rope", "Lead", "Yoga Studio", "Weights"]
    },
    {
      name: "Dogpatch Boulders",
      address: "2573 3rd St, San Francisco, CA 94107",
      distance: "1.2 miles away",
      hours: "Mon-Fri: 6am-11pm, Sat-Sun: 8am-9pm",
      amenities: ["Bouldering", "Kilter Board", "Moonboard", "Café"]
    },
    {
      name: "Berkeley Ironworks",
      address: "800 Potter St, Berkeley, CA 94710",
      distance: "8.5 miles away",
      hours: "Mon-Fri: 6am-11pm, Sat-Sun: 8am-10pm",
      amenities: ["Bouldering", "Top Rope", "Lead", "Weights", "Sauna"]
    },
  ];

  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full pb-[32px]">
      {locations.map((location, index) => (
        <LocationCard
          key={index}
          name={location.name}
          address={location.address}
          distance={location.distance}
          amenities={location.amenities}
          hours={location.hours}
          delay={0.3 + index * 0.1}
        />
      ))}
    </div>
  );
}