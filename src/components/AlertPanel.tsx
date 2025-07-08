
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Thermometer, Fan, Flame } from "lucide-react";
import { useFarm } from "@/contexts/FarmContext";

interface AlertPanelProps {
  currentTemp: number;
  targetTemp: number;
}

const AlertPanel = ({ currentTemp, targetTemp }: AlertPanelProps) => {
  const { activeFarm } = useFarm();
  
  if (!activeFarm) return null;
  
  // Round temperature values
  const displayTemp = Math.round(currentTemp);
  const isCritical = displayTemp > activeFarm.ageGroup.maxTemp + 3 || displayTemp < activeFarm.ageGroup.minTemp - 3;
  const needsHeating = displayTemp < activeFarm.ageGroup.minTemp;
  const needsCooling = displayTemp > activeFarm.ageGroup.maxTemp;
  const isOptimal = displayTemp >= activeFarm.ageGroup.minTemp && displayTemp <= activeFarm.ageGroup.maxTemp;

  if (isOptimal) return null;

  const getAlertVariant = () => {
    if (isCritical) return "destructive";
    return "default";
  };

  const getAlertContent = () => {
    if (isCritical && needsCooling) {
      return {
        title: "🚨 CRITICAL: Temperature Too High",
        description: `${displayTemp}°C is dangerously high for ${activeFarm.ageGroup.name}! Emergency cooling systems activated.`,
        icon: <Thermometer className="h-4 w-4 text-red-500" />,
        action: "cooling"
      };
    }
    if (isCritical && needsHeating) {
      return {
        title: "🚨 CRITICAL: Temperature Too Low",
        description: `${displayTemp}°C is dangerously low for ${activeFarm.ageGroup.name}! Emergency heating systems activated.`,
        icon: <Flame className="h-4 w-4 text-red-500" />,
        action: "heating"
      };
    }
    if (needsCooling) {
      return {
        title: "⚠️ Temperature Above Range",
        description: `${displayTemp}°C exceeds optimal range for ${activeFarm.ageGroup.name}. Cooling systems engaged.`,
        icon: <Fan className="h-4 w-4 text-orange-500" />,
        action: "cooling"
      };
    }
    if (needsHeating) {
      return {
        title: "⚠️ Temperature Below Range",
        description: `${displayTemp}°C is below optimal range for ${activeFarm.ageGroup.name}. Heating systems engaged.`,
        icon: <Flame className="h-4 w-4 text-blue-500" />,
        action: "heating"
      };
    }
  };

  const alertContent = getAlertContent();
  if (!alertContent) return null;

  return (
    <Alert variant={getAlertVariant()} className="border-l-4">
      <Bell className="h-4 w-4" />
      <AlertTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-sm sm:text-base">{alertContent.title}</span>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant={isCritical ? "destructive" : "secondary"}>
            {displayTemp}°C
          </Badge>
          <Badge variant="outline" className="text-xs">
            {activeFarm.name}: {activeFarm.ageGroup.minTemp}-{activeFarm.ageGroup.maxTemp}°C
          </Badge>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            Acknowledge
          </Button>
        </div>
      </AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 sm:mt-0">
        <span className="text-sm">{alertContent.description}</span>
        <span className="text-xs opacity-75 self-start sm:self-auto">
          Optimal: {activeFarm.ageGroup.minTemp}°C - {activeFarm.ageGroup.maxTemp}°C | Current: {displayTemp}°C
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default AlertPanel;
