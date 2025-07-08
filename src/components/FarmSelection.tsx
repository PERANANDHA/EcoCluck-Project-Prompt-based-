
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Plus } from "lucide-react";
import { useAge, AgeGroup } from "@/contexts/AgeContext";
import { useFarm } from "@/contexts/FarmContext";
import { useToast } from "@/hooks/use-toast";

interface FarmSelectionProps {
  onComplete: () => void;
  isAddingNew?: boolean;
}

const FarmSelection = ({ onComplete, isAddingNew = false }: FarmSelectionProps) => {
  const { toast } = useToast();
  const { ageGroups } = useAge();
  const { addFarm } = useFarm();
  const [farmName, setFarmName] = useState("");
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(ageGroups[0]);

  const handleCreateFarm = () => {
    if (!farmName.trim()) {
      toast({
        title: "Farm Name Required",
        description: "Please enter a name for your poultry farm",
        variant: "destructive",
      });
      return;
    }

    addFarm({
      name: farmName.trim(),
      ageGroup: selectedAge
    });

    toast({
      title: "Farm Created Successfully",
      description: `${farmName} has been created with ${selectedAge.name} configuration`,
    });

    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {isAddingNew ? (
            <Plus className="h-8 w-8 text-green-600" />
          ) : (
            <Thermometer className="h-8 w-8 text-green-600" />
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {isAddingNew ? "Add New Farm" : "Create Your First Farm"}
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isAddingNew 
            ? "Set up another poultry farm with its own climate control system."
            : "Welcome to Poultry Climate Control! Let's set up your first farm."
          }
        </p>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Farm Configuration</CardTitle>
          <CardDescription className="text-center">
            Enter your farm details and select the appropriate age group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Farm Name Input */}
          <div className="space-y-2">
            <Label htmlFor="farmName" className="text-base font-medium">
              Farm Name
            </Label>
            <Input
              id="farmName"
              placeholder="e.g., Sunny Valley Farm, North Coop, Main Facility..."
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Age Group Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Chicken Age Group</Label>
            <RadioGroup
              value={selectedAge.id}
              onValueChange={(value) => {
                const selected = ageGroups.find(age => age.id === value);
                if (selected) setSelectedAge(selected);
              }}
              className="space-y-4"
            >
              {ageGroups.map((age) => (
                <div key={age.id} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={age.id} id={age.id} />
                    <Label htmlFor={age.id} className="flex-1 cursor-pointer">
                      <Card className={`transition-all duration-200 ${
                        selectedAge.id === age.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-3xl">{age.icon}</div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{age.name}</h3>
                                  <Badge variant="outline">{age.ageRange}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{age.description}</p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-lg font-bold text-green-600">
                                {age.minTemp}°C - {age.maxTemp}°C
                              </div>
                              <div className="text-sm text-gray-500">
                                Target: {age.targetTemp}°C
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Climate Control Preview */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Climate Control Systems for {selectedAge.name}:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium text-blue-800">Heating Systems:</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Heat Lamp (when below {selectedAge.minTemp}°C)</li>
                  <li>• Safety Grill (protection & warmth)</li>
                </ul>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-blue-800">Cooling Systems:</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Exhaust Fans (when above {selectedAge.maxTemp}°C)</li>
                  <li>• Mist Sprayers (emergency cooling)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleCreateFarm}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              disabled={!farmName.trim()}
            >
              {isAddingNew ? "Add Farm" : "Create Farm"}
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmSelection;
