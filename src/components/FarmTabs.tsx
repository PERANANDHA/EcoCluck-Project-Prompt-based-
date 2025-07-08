
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, X } from "lucide-react";
import { useFarm } from "@/contexts/FarmContext";
import FarmSelection from "./FarmSelection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface FarmTabsProps {
  children: React.ReactNode;
}

const FarmTabs = ({ children }: FarmTabsProps) => {
  const { farms, activeFarmId, activeFarm, setActiveFarm, removeFarm } = useFarm();
  const { toast } = useToast();
  const [isAddingFarm, setIsAddingFarm] = useState(false);

  const handleRemoveFarm = (farmId: string, farmName: string) => {
    if (farms.length <= 1) {
      toast({
        title: "Cannot Remove Farm",
        description: "You must have at least one farm active",
        variant: "destructive",
      });
      return;
    }

    removeFarm(farmId);
    toast({
      title: "Farm Removed",
      description: `${farmName} has been removed from your management system`,
    });
  };

  const handleAddFarmComplete = () => {
    setIsAddingFarm(false);
  };

  if (farms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeFarmId || farms[0]?.id} onValueChange={setActiveFarm}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex-1 max-w-4xl">
            {farms.map((farm) => (
              <TabsTrigger 
                key={farm.id} 
                value={farm.id}
                className="flex items-center gap-2 relative group"
              >
                <span className="mr-1">{farm.ageGroup.icon}</span>
                <span className="font-medium">{farm.name}</span>
                <Badge variant="outline" className="text-xs ml-1">
                  {farm.ageGroup.ageRange}
                </Badge>
                {farms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 opacity-0 group-hover:opacity-100 hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFarm(farm.id, farm.name);
                    }}
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Dialog open={isAddingFarm} onOpenChange={setIsAddingFarm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Farm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Poultry Farm</DialogTitle>
              </DialogHeader>
              <FarmSelection onComplete={handleAddFarmComplete} isAddingNew={true} />
            </DialogContent>
          </Dialog>
        </div>

        {farms.map((farm) => (
          <TabsContent key={farm.id} value={farm.id} className="space-y-4">
            {/* Farm Info Header */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{farm.ageGroup.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{farm.name}</span>
                        <Badge variant="outline">{farm.ageGroup.ageRange}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Target Range: {farm.ageGroup.minTemp}°C - {farm.ageGroup.maxTemp}°C
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Dashboard Content */}
            {children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FarmTabs;
