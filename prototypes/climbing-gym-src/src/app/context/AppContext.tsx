import { createContext, useContext, useState, ReactNode } from 'react';

export interface Class {
  id: string;
  title: string;
  time: string;
  level: string;
  isBooked: boolean;
  location: string;
  date: string;
  instructor: string;
}

interface AppContextType {
  classes: Class[];
  bookClass: (id: string) => void;
  cancelBooking: (id: string) => void;
  getBookedClasses: () => Class[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([
    { 
      id: "1", 
      title: "Intro to Bouldering", 
      time: "9:00 AM", 
      level: "Beginner", 
      isBooked: false,
      location: "Mission Cliffs",
      date: "Mon, Mar 3",
      instructor: "Sarah Chen"
    },
    { 
      id: "2", 
      title: "V5 Advanced Tech", 
      time: "11:30 AM", 
      level: "Advanced", 
      isBooked: false,
      location: "Mission Cliffs",
      date: "Mon, Mar 3",
      instructor: "Mike Torres"
    },
    { 
      id: "3", 
      title: "Lead Climbing 101", 
      time: "2:00 PM", 
      level: "Intermediate", 
      isBooked: false,
      location: "Dogpatch Boulders",
      date: "Tue, Mar 4",
      instructor: "Alex Rivera"
    },
    { 
      id: "4", 
      title: "Yoga for Climbers", 
      time: "5:30 PM", 
      level: "All Levels", 
      isBooked: false,
      location: "Mission Cliffs",
      date: "Tue, Mar 4",
      instructor: "Emma Lee"
    },
    { 
      id: "5", 
      title: "Top Rope Technique", 
      time: "10:00 AM", 
      level: "Intermediate", 
      isBooked: false,
      location: "Dogpatch Boulders",
      date: "Wed, Mar 5",
      instructor: "Jordan Park"
    },
    { 
      id: "6", 
      title: "Youth Climbing", 
      time: "3:00 PM", 
      level: "Beginner", 
      isBooked: false,
      location: "Mission Cliffs",
      date: "Wed, Mar 5",
      instructor: "Taylor Kim"
    },
  ]);

  const bookClass = (id: string) => {
    setClasses(prevClasses => {
      return prevClasses.map(cls => 
        cls.id === id ? { ...cls, isBooked: true } : cls
      );
    });
  };

  const cancelBooking = (id: string) => {
    setClasses(prevClasses => {
      return prevClasses.map(cls => 
        cls.id === id ? { ...cls, isBooked: false } : cls
      );
    });
  };

  const getBookedClasses = () => {
    return classes.filter(cls => cls.isBooked);
  };

  return (
    <AppContext.Provider value={{ classes, bookClass, cancelBooking, getBookedClasses }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
