
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AgeGroup {
  id: 'chicks' | 'growers' | 'adults';
  name: string;
  description: string;
  ageRange: string;
  minTemp: number;
  maxTemp: number;
  targetTemp: number;
  icon: string;
}

interface AgeContextType {
  selectedAge: AgeGroup;
  ageGroups: AgeGroup[];
  setSelectedAge: (age: AgeGroup) => void;
  isInRange: (temperature: number) => boolean;
  shouldHeat: (temperature: number) => boolean;
  shouldCool: (temperature: number) => boolean;
}

const ageGroups: AgeGroup[] = [
  {
    id: 'chicks',
    name: 'Chicks',
    description: 'Newly hatched chickens requiring warm environment',
    ageRange: '0-1 week',
    minTemp: 32,
    maxTemp: 35,
    targetTemp: 33,
    icon: '🐣'
  },
  {
    id: 'growers',
    name: 'Growers',
    description: 'Young chickens developing their feathers',
    ageRange: '2-4 weeks',
    minTemp: 28,
    maxTemp: 32,
    targetTemp: 30,
    icon: '🐤'
  },
  {
    id: 'adults',
    name: 'Adults',
    description: 'Fully grown chickens with complete feathers',
    ageRange: '5+ weeks',
    minTemp: 20,
    maxTemp: 28,
    targetTemp: 24,
    icon: '🐔'
  }
];

const AgeContext = createContext<AgeContextType | undefined>(undefined);

export const useAge = () => {
  const context = useContext(AgeContext);
  if (context === undefined) {
    throw new Error('useAge must be used within an AgeProvider');
  }
  return context;
};

interface AgeProviderProps {
  children: ReactNode;
}

export const AgeProvider = ({ children }: AgeProviderProps) => {
  const [selectedAge, setSelectedAgeState] = useState<AgeGroup>(ageGroups[0]);

  // Load saved age group from localStorage
  useEffect(() => {
    const savedAgeId = localStorage.getItem('selectedAgeGroup');
    if (savedAgeId) {
      const savedAge = ageGroups.find(age => age.id === savedAgeId);
      if (savedAge) {
        setSelectedAgeState(savedAge);
      }
    }
  }, []);

  const setSelectedAge = (age: AgeGroup) => {
    setSelectedAgeState(age);
    localStorage.setItem('selectedAgeGroup', age.id);
    console.log(`Age group changed to: ${age.name} (${age.minTemp}°C - ${age.maxTemp}°C)`);
  };

  const isInRange = (temperature: number) => {
    const roundedTemp = Math.round(temperature);
    return roundedTemp >= selectedAge.minTemp && roundedTemp <= selectedAge.maxTemp;
  };

  const shouldHeat = (temperature: number) => {
    const roundedTemp = Math.round(temperature);
    return roundedTemp < selectedAge.minTemp;
  };

  const shouldCool = (temperature: number) => {
    const roundedTemp = Math.round(temperature);
    return roundedTemp > selectedAge.maxTemp;
  };

  return (
    <AgeContext.Provider value={{
      selectedAge,
      ageGroups,
      setSelectedAge,
      isInRange,
      shouldHeat,
      shouldCool
    }}>
      {children}
    </AgeContext.Provider>
  );
};
