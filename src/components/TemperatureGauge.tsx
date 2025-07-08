
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Gauge } from "lucide-react";

interface TemperatureGaugeProps {
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  minTemp: number;
  maxTemp: number;
}

const TemperatureGauge = ({ currentTemp, targetTemp, humidity, minTemp, maxTemp }: TemperatureGaugeProps) => {
  // Round values to ensure no decimals
  const displayTemp = Math.round(currentTemp);
  const displayHumidity = Math.round(humidity);
  
  const tempPercentage = Math.min((displayTemp / 50) * 100, 100);
  const isOptimal = displayTemp >= minTemp && displayTemp <= maxTemp;
  const isCritical = displayTemp > maxTemp + 3 || displayTemp < minTemp - 3;
  const isHot = displayTemp > maxTemp;
  const isCold = displayTemp < minTemp;
  
  const getTemperatureColor = () => {
    if (isCritical) return "text-red-600";
    if (isHot) return "text-orange-500";
    if (isCold) return "text-blue-500";
    if (isOptimal) return "text-green-600";
    return "text-gray-600";
  };

  const getStatusBadge = () => {
    if (isCritical) return <Badge variant="destructive">Critical</Badge>;
    if (isHot) return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Too Hot</Badge>;
    if (isCold) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Too Cold</Badge>;
    if (isOptimal) return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getBarColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isHot) return 'bg-orange-400';
    if (isCold) return 'bg-blue-400';
    if (isOptimal) return 'bg-green-500';
    return 'bg-gray-400';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <span className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Environmental Monitor</span>
            <span className="sm:hidden">Monitor</span>
          </span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription className="text-sm">Real-time temperature and humidity readings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Temperature Gauge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Temperature</span>
            <span className={`text-2xl sm:text-3xl font-bold ${getTemperatureColor()}`}>
              {displayTemp}°C
            </span>
          </div>
          
          {/* Visual Temperature Bar with Range Indicators */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
              <div 
                className={`h-3 sm:h-4 rounded-full transition-all duration-500 ${getBarColor()}`}
                style={{ width: `${tempPercentage}%` }}
              />
            </div>
            {/* Min temperature line */}
            <div 
              className="absolute top-0 w-1 h-3 sm:h-4 bg-blue-600 opacity-70"
              style={{ left: `${(minTemp / 50) * 100}%` }}
            />
            {/* Max temperature line */}
            <div 
              className="absolute top-0 w-1 h-3 sm:h-4 bg-red-600 opacity-70"
              style={{ left: `${(maxTemp / 50) * 100}%` }}
            />
            {/* Target line */}
            <div 
              className="absolute top-0 w-1 h-3 sm:h-4 bg-green-600"
              style={{ left: `${(targetTemp / 50) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0°C</span>
            <span className="font-medium text-center">
              Range: {minTemp}°C - {maxTemp}°C | Target: {targetTemp}°C
            </span>
            <span>50°C</span>
          </div>
        </div>

        {/* Humidity Display */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Humidity
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600">{displayHumidity}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${displayHumidity}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-gray-700">
              {isOptimal ? 'In Range' : Math.abs(displayTemp - (isHot ? maxTemp : minTemp))}
              {!isOptimal && '°C'}
            </div>
            <div className="text-xs text-gray-500">
              {isOptimal ? 'Status' : (isHot ? 'Above Max' : 'Below Min')}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-base sm:text-lg font-bold ${displayHumidity > 70 ? 'text-blue-600' : 'text-orange-500'}`}>
              {displayHumidity > 70 ? 'High' : 'Normal'}
            </div>
            <div className="text-xs text-gray-500">Humidity Level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureGauge;
