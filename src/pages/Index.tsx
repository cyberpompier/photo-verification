import { MadeWithDyad } from "@/components/made-with-dyad";
import VehicleDamageMarker from "@/components/VehicleDamageMarker"; // Import the new component

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <VehicleDamageMarker /> {/* Render the new component */}
      <MadeWithDyad />
    </div>
  );
};

export default Index;