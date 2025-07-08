
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useSensorData } from "@/contexts/SensorDataContext";
import { useFarm } from "@/contexts/FarmContext";
import { Badge } from "@/components/ui/badge";

interface EnvironmentalChartProps {
  farmId?: string;
}

const EnvironmentalChart = ({ farmId }: EnvironmentalChartProps) => {
  const { getFarmSensorData } = useSensorData();
  const { farms, activeFarm } = useFarm();
  
  // Use provided farmId or fallback to active farm
  const targetFarmId = farmId || activeFarm?.id;
  
  if (!targetFarmId) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        <p>No farm selected</p>
      </div>
    );
  }
  
  // Get the specific farm data for this farm ID
  const targetFarm = farms.find(farm => farm.id === targetFarmId) || activeFarm;
  const farmSensorData = getFarmSensorData(targetFarmId);
  const { historicalData, isConnected, lastUpdate } = farmSensorData;
  
  if (!targetFarm) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        <p>Farm data not available</p>
      </div>
    );
  }

  console.log(`EnvironmentalChart - Farm: ${targetFarm.name}, Category: ${targetFarm.ageGroup.name}, Data points: ${historicalData.length}`);

  // Transform farm-specific sensor data for the chart
  const chartData = historicalData.map(reading => ({
    time: reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: reading.temperature,
    humidity: reading.humidity,
    target: reading.target
  }));

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: "Humidity (%)",
      color: "hsl(var(--chart-2))",
    },
    target: {
      label: "Target Temp",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="w-full h-64 sm:h-80 min-h-[16rem] sm:min-h-[20rem]">
      {/* Connection Status and Farm Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Live Data" : "Disconnected"}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium">
            {targetFarm.ageGroup.name}: {targetFarm.ageGroup.minTemp}-{targetFarm.ageGroup.maxTemp}°C
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Farm: {targetFarm.name}
          </Badge>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {chartData.length} data points
          </span>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            Category: {targetFarm.ageGroup.name}
          </Badge>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ 
              top: 20, 
              right: 30, 
              left: 20, 
              bottom: 70
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={70}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              domain={['dataMin - 5', 'dataMax + 5']}
              width={50}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Time: ${value}`}
            />
            
            {/* Min temperature reference line */}
            <ReferenceLine 
              y={targetFarm.ageGroup.minTemp} 
              stroke="#3b82f6" 
              strokeDasharray="3 3" 
              strokeWidth={2}
              label={{ 
                value: `Min (${targetFarm.ageGroup.minTemp}°C)`, 
                position: "insideTopLeft",
                fontSize: 10,
                fill: "#3b82f6"
              }}
            />
            
            {/* Max temperature reference line */}
            <ReferenceLine 
              y={targetFarm.ageGroup.maxTemp} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              strokeWidth={2}
              label={{ 
                value: `Max (${targetFarm.ageGroup.maxTemp}°C)`, 
                position: "insideTopRight",
                fontSize: 10,
                fill: "#ef4444"
              }}
            />
            
            {/* Target temperature reference line */}
            <ReferenceLine 
              y={targetFarm.ageGroup.targetTemp} 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ 
                value: `Target (${targetFarm.ageGroup.targetTemp}°C)`, 
                position: "insideTopRight",
                fontSize: 12,
                fill: "#10b981"
              }}
            />
            
            {/* Temperature line */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
              name="Temperature"
            />
            
            {/* Humidity line */}
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              name="Humidity"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default EnvironmentalChart;
