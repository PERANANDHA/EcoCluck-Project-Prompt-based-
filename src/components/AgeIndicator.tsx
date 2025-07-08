
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAge } from "@/contexts/AgeContext";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const AgeIndicator = () => {
  const { selectedAge } = useAge();
  const navigate = useNavigate();

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedAge.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{selectedAge.name}</span>
                <Badge variant="outline">{selectedAge.ageRange}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                Target Range: {selectedAge.minTemp}°C - {selectedAge.maxTemp}°C
              </div>
            </div>
          </div>
          <Button
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            <Settings className="h-3 w-3 mr-1" />
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeIndicator;
