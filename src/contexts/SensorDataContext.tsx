import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SensorReading {
  timestamp: Date;
  temperature: number;
  humidity: number;
  target: number;
}

interface FarmSensorData {
  currentReading: SensorReading | null;
  historicalData: SensorReading[];
  isConnected: boolean;
  lastUpdate: Date | null;
}

interface SensorDataContextType {
  getFarmSensorData: (farmId: string) => FarmSensorData;
  registerFarm: (farmId: string, targetTemp: number, ageGroupName: string) => void;
  unregisterFarm: (farmId: string) => void;
}

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined);

export const useSensorData = () => {
  const context = useContext(SensorDataContext);
  if (context === undefined) {
    throw new Error('useSensorData must be used within a SensorDataProvider');
  }
  return context;
};

interface SensorDataProviderProps {
  children: ReactNode;
  setSensorCallbacks?: (callbacks: any) => void;
}

export const SensorDataProvider = ({ children, setSensorCallbacks }: SensorDataProviderProps) => {
  const [farmSensorData, setFarmSensorData] = useState<Record<string, FarmSensorData>>({});
  const [intervals, setIntervals] = useState<Record<string, NodeJS.Timeout>>({});

  // Register sensor callbacks with FarmContext
  useEffect(() => {
    if (setSensorCallbacks) {
      setSensorCallbacks({
        registerFarm,
        unregisterFarm
      });
    }
  }, [setSensorCallbacks]);

  const registerFarm = (farmId: string, targetTemp: number, ageGroupName: string) => {
    console.log(`Registering isolated sensor system for farm ${farmId} (${ageGroupName}) with target ${targetTemp}°C`);
    
    // Initialize farm sensor data if not exists
    if (!farmSensorData[farmId]) {
      const now = new Date();
      const initialData: SensorReading[] = [];
      
      // Create 24 hours of initial data points for this specific farm with category-specific variations
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        
        // Category-specific temperature variations
        let baseVariation = 0;
        let variationRange = 3; // Default ±3°C
        
        if (ageGroupName === 'Chicks') {
          baseVariation = (Math.random() - 0.5) * 4; // ±2°C for chicks (more stable)
          variationRange = 2;
        } else if (ageGroupName === 'Growers') {
          baseVariation = (Math.random() - 0.5) * 6; // ±3°C for growers
          variationRange = 3;
        } else if (ageGroupName === 'Adults') {
          baseVariation = (Math.random() - 0.5) * 8; // ±4°C for adults (more tolerant)
          variationRange = 4;
        }
        
        initialData.push({
          timestamp,
          temperature: Math.round(targetTemp + baseVariation),
          humidity: Math.round(65 + (Math.random() - 0.5) * 10),
          target: targetTemp
        });
      }
      
      setFarmSensorData(prev => ({
        ...prev,
        [farmId]: {
          currentReading: null,
          historicalData: initialData,
          isConnected: true,
          lastUpdate: null
        }
      }));

      // Start isolated sensor simulation for this specific farm
      const interval = setInterval(() => {
        const now = new Date();
        
        // Category-specific temperature simulation
        let variation = 0;
        if (ageGroupName === 'Chicks') {
          variation = (Math.random() - 0.5) * 4; // ±2°C for chicks
        } else if (ageGroupName === 'Growers') {
          variation = (Math.random() - 0.5) * 6; // ±3°C for growers
        } else if (ageGroupName === 'Adults') {
          variation = (Math.random() - 0.5) * 8; // ±4°C for adults
        }
        
        const temperature = Math.round(targetTemp + variation);
        
        const newReading: SensorReading = {
          timestamp: now,
          temperature: temperature,
          humidity: Math.round(60 + Math.random() * 20),
          target: targetTemp
        };

        setFarmSensorData(prev => ({
          ...prev,
          [farmId]: {
            ...prev[farmId],
            currentReading: newReading,
            lastUpdate: now,
            historicalData: [...prev[farmId].historicalData, newReading].filter(
              reading => reading.timestamp.getTime() > now.getTime() - 24 * 60 * 60 * 1000
            )
          }
        }));

        console.log(`Farm ${farmId} (${ageGroupName}) isolated sensor reading:`, newReading);
      }, 10000); // Update every 10 seconds

      setIntervals(prev => ({ ...prev, [farmId]: interval }));
    }
  };

  const unregisterFarm = (farmId: string) => {
    console.log(`Unregistering isolated sensor system for farm ${farmId}`);
    
    // Clear interval for this farm
    if (intervals[farmId]) {
      clearInterval(intervals[farmId]);
      setIntervals(prev => {
        const newIntervals = { ...prev };
        delete newIntervals[farmId];
        return newIntervals;
      });
    }
    
    // Remove farm sensor data
    setFarmSensorData(prev => {
      const newData = { ...prev };
      delete newData[farmId];
      return newData;
    });
  };

  const getFarmSensorData = (farmId: string): FarmSensorData => {
    return farmSensorData[farmId] || {
      currentReading: null,
      historicalData: [],
      isConnected: false,
      lastUpdate: null
    };
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [intervals]);

  return (
    <SensorDataContext.Provider value={{
      getFarmSensorData,
      registerFarm,
      unregisterFarm
    }}>
      {children}
    </SensorDataContext.Provider>
  );
};
