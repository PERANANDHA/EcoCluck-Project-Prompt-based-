
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Fan, Gauge, Monitor, Flame, Shield } from "lucide-react";

interface SystemStatus {
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

interface SystemControlsProps {
  systemStatus: SystemStatus;
  onSystemToggle: (system: string, enabled: boolean) => void;
  farmName?: string;
}

const SystemControls = ({ systemStatus, onSystemToggle, farmName }: SystemControlsProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          System Controls
        </CardTitle>
        <CardDescription className="text-sm">
          {farmName ? `${farmName} - Independent climate control` : "Climate control and safety systems management"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Auto Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-h-[60px] sm:min-h-[auto]">
          <div className="flex-1 pr-3">
            <div className="font-medium text-sm sm:text-base">Automatic Mode</div>
            <div className="text-xs sm:text-sm text-gray-600">Age-based temperature regulation</div>
          </div>
          <Switch
            checked={systemStatus.autoMode}
            onCheckedChange={(checked) => onSystemToggle('autoMode', checked)}
            className="min-w-[44px] min-h-[24px]"
          />
        </div>

        {/* Heating Systems Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-sm font-medium text-red-700">🔥 Heating Systems</div>
            <Badge variant="outline" className="text-xs">
              Below Range Control
            </Badge>
          </div>
          
          {/* Heat Lamp Control */}
          <div className="flex items-center justify-between p-3 border rounded-lg min-h-[60px]">
            <div className="flex items-center gap-3 flex-1">
              <Flame className={`h-4 w-4 sm:h-5 sm:w-5 ${systemStatus.heatLampActive ? 'text-red-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="hidden sm:inline">Heat Lamp</span>
                  <span className="sm:hidden">Heat</span>
                  {systemStatus.manualHeatOverride && (
                    <Badge variant="secondary" className="text-xs">Manual</Badge>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {systemStatus.manualHeatOverride 
                    ? "Manual override active" 
                    : "Primary heating system"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.heatLampActive ? "destructive" : "secondary"} className="text-xs">
                {systemStatus.heatLampActive ? "On" : "Off"}
              </Badge>
              <Switch
                checked={systemStatus.heatLampActive}
                onCheckedChange={(checked) => onSystemToggle('heatLampActive', checked)}
                className="min-w-[44px] min-h-[24px]"
              />
            </div>
          </div>

          {/* Safety Grill Control */}
          <div className="flex items-center justify-between p-3 border rounded-lg min-h-[60px]">
            <div className="flex items-center gap-3 flex-1">
              <Shield className={`h-4 w-4 sm:h-5 sm:w-5 ${systemStatus.safetyGrillActive ? 'text-orange-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="hidden sm:inline">Safety Grill</span>
                  <span className="sm:hidden">Grill</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Protection & heat distribution
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.safetyGrillActive ? "destructive" : "secondary"} className="text-xs">
                {systemStatus.safetyGrillActive ? "Active" : "Off"}
              </Badge>
              <Switch
                checked={systemStatus.safetyGrillActive}
                onCheckedChange={(checked) => onSystemToggle('safetyGrillActive', checked)}
                className="min-w-[44px] min-h-[24px]"
              />
            </div>
          </div>

          {/* Manual Override Toggle for Heating */}
          <div className="ml-6 sm:ml-8 flex items-center justify-between text-sm min-h-[44px]">
            <span className="text-gray-600">Manual Override Heating</span>
            <Switch
              checked={systemStatus.manualHeatOverride}
              onCheckedChange={(checked) => onSystemToggle('manualHeatOverride', checked)}
              className="min-w-[44px] min-h-[24px]"
            />
          </div>
        </div>

        {/* Cooling Systems Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="text-sm font-medium text-blue-700">❄️ Cooling Systems</div>
            <Badge variant="outline" className="text-xs">
              Above Range Control
            </Badge>
          </div>
          
          {/* Fan Control */}
          <div className="flex items-center justify-between p-3 border rounded-lg min-h-[60px]">
            <div className="flex items-center gap-3 flex-1">
              <Fan className={`h-4 w-4 sm:h-5 sm:w-5 ${systemStatus.fanRunning ? 'text-blue-600 animate-spin' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="hidden sm:inline">Cooling Fans</span>
                  <span className="sm:hidden">Fans</span>
                  {systemStatus.manualFanOverride && (
                    <Badge variant="secondary" className="text-xs">Manual</Badge>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {systemStatus.manualFanOverride 
                    ? "Manual override active" 
                    : "Exhaust ventilation system"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.fanRunning ? "default" : "secondary"} className="text-xs">
                {systemStatus.fanRunning ? "On" : "Off"}
              </Badge>
              <Switch
                checked={systemStatus.fanRunning}
                onCheckedChange={(checked) => onSystemToggle('fanRunning', checked)}
                className="min-w-[44px] min-h-[24px]"
              />
            </div>
          </div>

          {/* Mist Sprayer Control */}
          <div className="flex items-center justify-between p-3 border rounded-lg min-h-[60px]">
            <div className="flex items-center gap-3 flex-1">
              <Gauge className={`h-4 w-4 sm:h-5 sm:w-5 ${systemStatus.mistSprayerActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="hidden sm:inline">Mist Sprayer</span>
                  <span className="sm:hidden">Mist</span>
                  {systemStatus.manualMistOverride && (
                    <Badge variant="secondary" className="text-xs">Manual</Badge>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {systemStatus.manualMistOverride 
                    ? "Manual override active" 
                    : "Emergency water cooling"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStatus.mistSprayerActive ? "default" : "secondary"} className="text-xs">
                {systemStatus.mistSprayerActive ? "On" : "Off"}
              </Badge>
              <Switch
                checked={systemStatus.mistSprayerActive}
                onCheckedChange={(checked) => onSystemToggle('mistSprayerActive', checked)}
                className="min-w-[44px] min-h-[24px]"
              />
            </div>
          </div>

          {/* Manual Override Toggles for Cooling */}
          <div className="ml-6 sm:ml-8 space-y-2">
            <div className="flex items-center justify-between text-sm min-h-[44px]">
              <span className="text-gray-600">Manual Override Fan</span>
              <Switch
                checked={systemStatus.manualFanOverride}
                onCheckedChange={(checked) => onSystemToggle('manualFanOverride', checked)}
                className="min-w-[44px] min-h-[24px]"
              />
            </div>
            <div className="flex items-center justify-between text-sm min-h-[44px]">
              <span className="text-gray-600">Manual Override Mist</span>
              <Switch
                checked={systemStatus.manualMistOverride}
                onCheckedChange={(checked) => onSystemToggle('manualMistOverride', checked)}
                className="min-w-[44px] min-h-[24px]"
              />
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium text-gray-700">Emergency Controls</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-red-600 min-h-[44px]">
              Emergency Stop
            </Button>
            <Button variant="outline" size="sm" className="text-green-600 min-h-[44px]">
              Force Optimal
            </Button>
          </div>
        </div>

        {/* Status Information */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Update:</span>
            <span className="font-medium">
              {systemStatus.lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Farm Connection:</span>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Monitor className="h-3 w-3 mr-1" />
              {farmName || "Farm"} Online
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemControls;
