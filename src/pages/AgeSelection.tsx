
import { useNavigate } from "react-router-dom";
import FarmSelection from "@/components/FarmSelection";
import { useFarm } from "@/contexts/FarmContext";
import { useEffect } from "react";

const AgeSelection = () => {
  const navigate = useNavigate();
  const { farms } = useFarm();

  // If farms exist, redirect to dashboard
  useEffect(() => {
    if (farms.length > 0) {
      navigate('/dashboard');
    }
  }, [farms, navigate]);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <FarmSelection onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default AgeSelection;
