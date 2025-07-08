
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Fan, Gauge, Settings, Bell, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TemperatureGauge from "@/components/TemperatureGauge";
import SystemControls from "@/components/SystemControls";
import AlertPanel from "@/components/AlertPanel";
import EnvironmentalChart from "@/components/EnvironmentalChart";
import SystemStatus from "@/components/SystemStatus";
import FarmTabs from "@/components/FarmTabs";
import { useSensorData } from "@/contexts/SensorDataContext";
import { useFarm } from "@/contexts/FarmContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getFarmSensorData } = useSensorData();
  const { farms, activeFarm, updateFarmSystemStatus } = useFarm();
  
  // Redirect to age selection if no farms exist
  useEffect(() => {
    if (farms.length === 0) {
      navigate('/');
    }
  }, [farms, navigate]);

  // If no active farm, show loading or redirect
  if (!activeFarm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Farm Data...</h2>
          <p className="text-gray-600">Please wait while we load your farm information.</p>
        </div>
      </div>
    );
  }

  // Get farm-specific sensor data for the ACTIVE farm only
  const activeFarmSensorData = getFarmSensorData(activeFarm.id);
  const currentReading = activeFarmSensorData.currentReading;
  const isConnected = activeFarmSensorData.isConnected;

  // Use farm-specific sensor data when available, fallback to defaults - round to whole numbers
  const currentTemp = Math.round(currentReading?.temperature ?? activeFarm.ageGroup.targetTemp);
  const currentHumidity = Math.round(currentReading?.humidity ?? 65);
  
  console.log(`Dashboard - Active Farm: ${activeFarm.name} (${activeFarm.ageGroup.name}), Current Temp: ${currentTemp}°C`);

  // Helper functions for the ACTIVE farm's age-specific logic
  const shouldHeat = (temperature: number) => {
    const roundedTemp = Math.round(temperature);
    return roundedTemp < activeFarm.ageGroup.minTemp;
  };

  const shouldCool = (temperature: number) => {
    const roundedTemp = Math.round(temperature);
    return roundedTemp > activeFarm.ageGroup.maxTemp;
  };

  const isInRange = (temperature: number) => {
    const roundedTemp = Math.round(temperature);
    return roundedTemp >= activeFarm.ageGroup.minTemp && roundedTemp <= activeFarm.ageGroup.maxTemp;
  };

  // Farm-specific automation logic ONLY for the active farm
  useEffect(() => {
    if (!currentReading || !activeFarm) return;

    const newTemp = Math.round(currentReading.temperature);
    const needsHeating = shouldHeat(newTemp);
    const needsCooling = shouldCool(newTemp);
    const currentSystemStatus = activeFarm.systemStatus;
    
    console.log(`Automation check for ${activeFarm.name} (${activeFarm.ageGroup.name}): Temp=${newTemp}°C, Needs Heating=${needsHeating}, Needs Cooling=${needsCooling}`);
    
    const updates: any = {};

    // Only update systems if auto mode is on and no manual overrides for THIS SPECIFIC FARM
    if (currentSystemStatus.autoMode) {
      // Heating systems (when temperature is below range)
      if (!currentSystemStatus.manualHeatOverride) {
        updates.heatLampActive = needsHeating;
        updates.safetyGrillActive = needsHeating;
      }

      // Cooling systems (when temperature is above range)
      if (!currentSystemStatus.manualFanOverride) {
        updates.fanRunning = needsCooling;
      }
      if (!currentSystemStatus.manualMistOverride) {
        updates.mistSprayerActive = needsCooling && newTemp > activeFarm.ageGroup.maxTemp + 2; // Emergency cooling
      }
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      updateFarmSystemStatus(activeFarm.id, updates);
      console.log(`Updated systems for ${activeFarm.name}:`, updates);
    }

    // Send farm-specific alerts for critical temperatures
    if (needsCooling && newTemp > activeFarm.ageGroup.maxTemp + 3) {
      toast({
        title: `Critical Temperature Alert - ${activeFarm.name}!`,
        description: `Temperature ${newTemp}°C is dangerously high for ${activeFarm.ageGroup.name} (${activeFarm.ageGroup.minTemp}-${activeFarm.ageGroup.maxTemp}°C) - Emergency cooling activated`,
        variant: "destructive",
      });
    } else if (needsHeating && newTemp < activeFarm.ageGroup.minTemp - 3) {
      toast({
        title: `Critical Temperature Alert - ${activeFarm.name}!`,
        description: `Temperature ${newTemp}°C is dangerously low for ${activeFarm.ageGroup.name} (${activeFarm.ageGroup.minTemp}-${activeFarm.ageGroup.maxTemp}°C) - Emergency heating activated`,
        variant: "destructive",
      });
    }
  }, [currentReading, activeFarm?.id, activeFarm?.ageGroup, activeFarm?.systemStatus, updateFarmSystemStatus, toast]);

  const handleSystemToggle = (system: string, enabled: boolean) => {
    if (!activeFarm) return;
    
    console.log(`Farm ${activeFarm.name} (${activeFarm.ageGroup.name}) - System toggle: ${system} = ${enabled}`);
    
    updateFarmSystemStatus(activeFarm.id, {
      [system]: enabled
    });
    
    const systemName = system.replace(/([A-Z])/g, ' $1').toLowerCase();
    toast({
      title: `${activeFarm.name} (${activeFarm.ageGroup.name}) - System Updated`,
      description: `${systemName} has been ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Thermometer className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <span className="hidden sm:inline">Poultry Farm Climate Control</span>
              <span className="sm:hidden">Climate Control</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Farm-Specific Temperature Management System - All Categories Isolated
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Sensors Online" : "Sensors Offline"}
            </Badge>
            <Badge variant={activeFarm.systemStatus.powerStatus === "normal" ? "default" : "destructive"} className="text-xs">
              {activeFarm.systemStatus.powerStatus === "normal" ? "System Online" : "System Error"}
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Active: {activeFarm.ageGroup.name}
            </Badge>
          </div>
        </div>

        {/* Farm Tabs and Dashboard Content */}
        <FarmTabs>
          {/* Alert Panel */}
          <AlertPanel currentTemp={currentTemp} targetTemp={activeFarm.ageGroup.targetTemp} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Left Section - Temperature Monitoring and Chart */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              {/* Temperature and Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <TemperatureGauge 
                  currentTemp={currentTemp}
                  targetTemp={activeFarm.ageGroup.targetTemp}
                  humidity={currentHumidity}
                  minTemp={activeFarm.ageGroup.minTemp}
                  maxTemp={activeFarm.ageGroup.maxTemp}
                />
                <SystemStatus systemStatus={activeFarm.systemStatus} />
              </div>
              
              {/* Environmental Chart */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <History className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Real-Time Temperature Trends</span>
                    <span className="sm:hidden">Temperature Trends</span>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {activeFarm.ageGroup.name} Category
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Live sensor data for {activeFarm.name} ({activeFarm.ageGroup.name} - {activeFarm.ageGroup.minTemp}°C to {activeFarm.ageGroup.maxTemp}°C)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="w-full overflow-hidden">
                    <EnvironmentalChart farmId={activeFarm.id} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Section - System Controls and Stats */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <SystemControls 
                systemStatus={activeFarm.systemStatus}
                onSystemToggle={handleSystemToggle}
                farmName={activeFarm.name}
              />
              
              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    {activeFarm.name} Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="font-medium text-green-700">
                      {activeFarm.ageGroup.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Temp</span>
                    <span className="font-medium">{currentTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Range</span>
                    <span className="font-medium">{activeFarm.ageGroup.minTemp}-{activeFarm.ageGroup.maxTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Heating Status</span>
                    <span className="font-medium">
                      {activeFarm.systemStatus.heatLampActive ? "Active" : "Off"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cooling Status</span>
                    <span className="font-medium">
                      {activeFarm.systemStatus.fanRunning ? "Active" : "Off"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Age Range</span>
                    <span className="font-medium text-xs">
                      {activeFarm.ageGroup.ageRange}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Farm ID</span>
                    <span className="font-medium text-xs">
                      {activeFarm.id.slice(-8)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </FarmTabs>
      </div>
    </div>
  );
};

export default Dashboard;
