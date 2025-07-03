"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Marker {
  x: number; // Percentage from left
  y: number; // Percentage from top
}

const VehicleDamageMarker: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setMarkers([]); // Clear markers when a new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedImage || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100; // Percentage
    const y = ((event.clientY - rect.top) / rect.height) * 100; // Percentage

    setMarkers((prevMarkers) => [...prevMarkers, { x, y }]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Marqueur de Dommages Véhicule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label htmlFor="image-upload" className="block text-center">
            <Button asChild className="w-full">
              <span>{selectedImage ? "Changer l'image" : "Télécharger une image du véhicule"}</span>
            </Button>
          </label>
        </div>

        {selectedImage && (
          <div
            ref={imageContainerRef}
            className="relative w-full overflow-hidden border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair"
            style={{ paddingTop: '75%', backgroundImage: `url(${selectedImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            onClick={handleImageClick}
          >
            {markers.map((marker, index) => (
              <div
                key={index}
                className={cn(
                  "absolute w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer",
                  "transform -translate-x-1/2 -translate-y-1/2"
                )}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                title={`Marqueur ${index + 1}`}
              >
                <PlusCircle className="w-4 h-4" />
              </div>
            ))}
          </div>
        )}

        {selectedImage && markers.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            <p>{markers.length} marqueur(s) placé(s). Cliquez sur l'image pour en ajouter d'autres.</p>
          </div>
        )}

        {selectedImage && markers.length === 0 && (
          <div className="mt-6 text-center text-gray-600">
            <p>Cliquez sur l'image pour ajouter des marqueurs de dommages.</p>
          </div>
        )}

        {!selectedImage && (
          <div className="mt-6 text-center text-gray-500">
            <p>Veuillez télécharger une image pour commencer.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleDamageMarker;