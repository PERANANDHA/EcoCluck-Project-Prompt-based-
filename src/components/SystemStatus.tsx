
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Fan, Gauge, Thermometer, Flame, Shield } from "lucide-react";

interface SystemStatus {
  autoMode: boolean;
  fanRunning: boolean;
  mistSprayerActive: boolean;
  heatLampActive: boolean;
  safetyGrillActive: boolean;
  powerStatus: string;
  lastUpdate: Date;
  manualFanOverride: boolean;
  manualMistOverride: boolean;
  manualHeatOverride: boolean;
}

interface SystemStatusProps {
  systemStatus: SystemStatus;
}

const SystemStatus = ({ systemStatus }: SystemStatusProps) => {
  const getStatusColor = (isActive: boolean) => isActive ? "text-green-600" : "text-gray-400";
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>Current operational status - farm-specific systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Operation Mode */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Operation Mode</span>
          </div>
          <Badge variant={systemStatus.autoMode ? "default" : "secondary"}>
            {systemStatus.autoMode ? "Automatic" : "Manual"}
          </Badge>
        </div>

        {/* Component Status */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Component Status</div>
          
          <div className="grid gap-3">
            {/* Heat Lamp Status */}
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <Flame className={`h-4 w-4 ${getStatusColor(systemStatus.heatLampActive)}`} />
                <span className="text-sm">Heat Lamp</span>
                {systemStatus.manualHeatOverride && (
                  <Badge variant="outline" className="text-xs">Manual</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.heatLampActive ? 'bg-red-500' : 'bg-gray-300'}`} />
                <span className="text-xs">{systemStatus.heatLampActive ? 'Heating' : 'Off'}</span>
              </div>
            </div>

            {/* Safety Grill Status */}
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${getStatusColor(systemStatus.safetyGrillActive)}`} />
                <span className="text-sm">Safety Grill</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.safetyGrillActive ? 'bg-orange-500' : 'bg-gray-300'}`} />
                <span className="text-xs">{systemStatus.safetyGrillActive ? 'Active' : 'Off'}</span>
              </div>
            </div>

            {/* Fan Status */}
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <Fan className={`h-4 w-4 ${getStatusColor(systemStatus.fanRunning)} ${systemStatus.fanRunning ? 'animate-spin' : ''}`} />
                <span className="text-sm">Cooling Fans</span>
                {systemStatus.manualFanOverride && (
                  <Badge variant="outline" className="text-xs">Manual</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.fanRunning ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className="text-xs">{systemStatus.fanRunning ? 'Running' : 'Stopped'}</span>
              </div>
            </div>

            {/* Mist Sprayer Status */}
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <Gauge className={`h-4 w-4 ${getStatusColor(systemStatus.mistSprayerActive)}`} />
                <span className="text-sm">Mist Sprayer</span>
                {systemStatus.manualMistOverride && (
                  <Badge variant="outline" className="text-xs">Manual</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.mistSprayerActive ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className="text-xs">{systemStatus.mistSprayerActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            {/* Power Status */}
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-green-600" />
                <span className="text-sm">Power Supply</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs">Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="pt-3 border-t">
          <div className="text-sm font-medium text-gray-700 mb-2">System Health</div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">98%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {systemStatus.manualFanOverride || systemStatus.manualMistOverride || systemStatus.manualHeatOverride ? 'Mixed' : systemStatus.autoMode ? 'Auto' : 'Manual'}
              </div>
              <div className="text-xs text-gray-500">Control Mode</div>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-3 border-t text-xs text-gray-500">
          Last updated: {systemStatus.lastUpdate.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
