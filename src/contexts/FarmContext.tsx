import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SystemStatus {
  autoMode: boolean;
  fanRunning: boolean;
  mistSprayerActive: boolean;
  heatLampActive: boolean;
  safetyGrillActive: boolean;
  powerStatus: string;
  lastUpdate: Date;
  // Manual override states
  manualFanOverride: boolean;
  manualMistOverride: boolean;
  manualHeatOverride: boolean;
}

export interface Farm {
  id: string;
  name: string;
  ageGroup: {
    id: 'chicks' | 'growers' | 'adults';
    name: string;
    description: string;
    ageRange: string;
    minTemp: number;
    maxTemp: number;
    targetTemp: number;
    icon: string;
  };
  systemStatus: SystemStatus;
  createdAt: Date;
}

interface FarmContextType {
  farms: Farm[];
  activeFarmId: string | null;
  activeFarm: Farm | null;
  addFarm: (farm: Omit<Farm, 'id' | 'createdAt' | 'systemStatus'>) => void;
  removeFarm: (farmId: string) => void;
  setActiveFarm: (farmId: string) => void;
  updateFarm: (farmId: string, updates: Partial<Farm>) => void;
  updateFarmSystemStatus: (farmId: string, systemStatus: Partial<SystemStatus>) => void;
}

interface SensorDataContextType {
  getFarmSensorData: (farmId: string) => any;
  registerFarm: (farmId: string, targetTemp: number, ageGroupName: string) => void;
  unregisterFarm: (farmId: string) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

interface FarmProviderProps {
  children: ReactNode;
}

const createDefaultSystemStatus = (): SystemStatus => ({
  autoMode: true,
  fanRunning: false,
  mistSprayerActive: false,
  heatLampActive: false,
  safetyGrillActive: false,
  powerStatus: "normal",
  lastUpdate: new Date(),
  manualFanOverride: false,
  manualMistOverride: false,
  manualHeatOverride: false
});

export const FarmProvider = ({ children }: FarmProviderProps) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null);

  // Load farms from localStorage
  useEffect(() => {
    const savedFarms = localStorage.getItem('poultryFarms');
    const savedActiveFarmId = localStorage.getItem('activeFarmId');
    
    if (savedFarms) {
      const parsedFarms = JSON.parse(savedFarms).map((farm: any) => ({
        ...farm,
        createdAt: new Date(farm.createdAt),
        systemStatus: farm.systemStatus || createDefaultSystemStatus()
      }));
      setFarms(parsedFarms);
    }
    
    if (savedActiveFarmId) {
      setActiveFarmId(savedActiveFarmId);
    }
  }, []);

  // Save farms to localStorage
  useEffect(() => {
    if (farms.length > 0) {
      localStorage.setItem('poultryFarms', JSON.stringify(farms));
    }
  }, [farms]);

  // Save active farm ID
  useEffect(() => {
    if (activeFarmId) {
      localStorage.setItem('activeFarmId', activeFarmId);
    }
  }, [activeFarmId]);

  const addFarm = (farmData: Omit<Farm, 'id' | 'createdAt' | 'systemStatus'>) => {
    const newFarm: Farm = {
      ...farmData,
      id: Date.now().toString(),
      createdAt: new Date(),
      systemStatus: createDefaultSystemStatus()
    };
    
    setFarms(prev => [...prev, newFarm]);
    setActiveFarmId(newFarm.id);
    
    console.log(`New farm added: ${newFarm.name} (${newFarm.ageGroup.name}) with completely isolated sensor system`);
  };

  const removeFarm = (farmId: string) => {
    setFarms(prev => prev.filter(farm => farm.id !== farmId));
    
    if (activeFarmId === farmId) {
      const remainingFarms = farms.filter(farm => farm.id !== farmId);
      setActiveFarmId(remainingFarms.length > 0 ? remainingFarms[0].id : null);
    }
  };

  const setActiveFarm = (farmId: string) => {
    setActiveFarmId(farmId);
  };

  const updateFarm = (farmId: string, updates: Partial<Farm>) => {
    setFarms(prev => prev.map(farm => 
      farm.id === farmId ? { ...farm, ...updates } : farm
    ));
  };

  const updateFarmSystemStatus = (farmId: string, systemStatusUpdates: Partial<SystemStatus>) => {
    setFarms(prev => prev.map(farm => 
      farm.id === farmId 
        ? { 
            ...farm, 
            systemStatus: { 
              ...farm.systemStatus, 
              ...systemStatusUpdates,
              lastUpdate: new Date()
            } 
          } 
        : farm
    ));
    
    console.log(`Farm ${farmId} system updated:`, systemStatusUpdates);
  };

  const activeFarm = farms.find(farm => farm.id === activeFarmId) || null;

  return (
    <FarmContext.Provider value={{
      farms,
      activeFarmId,
      activeFarm,
      addFarm,
      removeFarm,
      setActiveFarm,
      updateFarm,
      updateFarmSystemStatus
    }}>
      {children}
    </FarmContext.Provider>
  );
};
