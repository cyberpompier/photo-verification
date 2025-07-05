"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Maximize, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Marker {
  x: number; // Percentage from left
  y: number; // Percentage from top
  annotation?: string; // Optional annotation text
  date: string; // Date of the report
  userName: string; // User who made the report
}

const VehicleDamageMarker: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState<number | null>(null);
  const [annotationText, setAnnotationText] = useState<string>("");
  const [userNameText, setUserNameText] = useState<string>("");

  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

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

    // Only add a new marker if the click is directly on the image container, not on an existing marker
    if (event.target === imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100; // Percentage
      const y = ((event.clientY - rect.top) / rect.height) * 100; // Percentage

      setMarkers((prevMarkers) => [...prevMarkers, { x, y, annotation: "", date: new Date().toLocaleDateString(), userName: "" }]);
    }
  };

  const handleMarkerClick = (index: number) => {
    setCurrentMarkerIndex(index);
    setAnnotationText(markers[index].annotation || "");
    setUserNameText(markers[index].userName || "");
    setIsAnnotationDialogOpen(true);
  };

  const handleSaveAnnotation = () => {
    if (currentMarkerIndex !== null) {
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker, idx) =>
          idx === currentMarkerIndex ? { ...marker, annotation: annotationText, userName: userNameText } : marker
        )
      );
      setIsAnnotationDialogOpen(false);
      setCurrentMarkerIndex(null);
      setAnnotationText("");
      setUserNameText("");
    }
  };

  const handleDeleteMarker = () => {
    if (currentMarkerIndex !== null) {
      setMarkers((prevMarkers) => prevMarkers.filter((_, idx) => idx !== currentMarkerIndex));
      setIsAnnotationDialogOpen(false);
      setCurrentMarkerIndex(null);
      setAnnotationText("");
      setUserNameText("");
    }
  };

  const handleOpenFullScreen = () => {
    setIsFullScreenOpen(true);
    setZoomLevel(1); // Reset zoom when opening full screen
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x
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
            {/* Fullscreen button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation(); // Prevent image click from adding marker
                handleOpenFullScreen();
              }}
            >
              <Maximize className="h-4 w-4" />
            </Button>

            {markers.map((marker, index) => (
              <div
                key={index}
                className={cn(
                  "absolute w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer",
                  marker.annotation ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600",
                  "transform -translate-x-1/2 -translate-y-1/2"
                )}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent image click from firing
                  handleMarkerClick(index);
                }}
                title={marker.annotation || `Marqueur ${index + 1}`}
              >
                <PlusCircle className="w-4 h-4" />
              </div>
            ))}
          </div>
        )}

        {selectedImage && markers.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            <p>{markers.length} marqueur(s) placé(s). Cliquez sur un marqueur pour ajouter une annotation.</p>
          </div>
        )}

        {selectedImage && markers.length === 0 && (
          <div className="mt-6 text-center text-gray-600">
            <p>Veuillez télécharger une image pour commencer.</p>
          </div>
        )}

        {!selectedImage && (
          <div className="mt-6 text-center text-gray-500">
            <p>Veuillez télécharger une image pour commencer.</p>
          </div>
        )}

        {selectedImage && markers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Détails des dommages signalés :</h3>
            <ul className="space-y-2">
              {markers.map((marker, index) => (
                <li key={index} className="p-3 border rounded-md bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-left">
                    <p className="font-medium">Marqueur {index + 1}: {marker.annotation || "Aucune annotation"}</p>
                    <p className="text-sm text-gray-600">Signalé par: {marker.userName || "Inconnu"}</p>
                    <p className="text-sm text-gray-600">Date: {marker.date}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleMarkerClick(index)} className="mt-2 sm:mt-0">
                    Modifier
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <Dialog open={isAnnotationDialogOpen} onOpenChange={setIsAnnotationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter/Modifier l'annotation</DialogTitle>
            <DialogDescription>
              Décrivez le dommage pour ce marqueur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="userName">Nom de l'utilisateur</Label>
              <Input
                id="userName"
                value={userNameText}
                onChange={(e) => setUserNameText(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="annotation">Annotation</Label>
              <Textarea
                id="annotation"
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Ex: Rayure profonde sur la portière avant gauche."
              />
            </div>
            {currentMarkerIndex !== null && markers[currentMarkerIndex] && (
              <p className="text-sm text-gray-500">
                Signalé le: {markers[currentMarkerIndex].date}
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="destructive" onClick={handleDeleteMarker} className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer le marqueur
            </Button>
            <Button onClick={handleSaveAnnotation} className="w-full sm:w-auto">
              Sauvegarder l'annotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Dialog for Image Zoom */}
      <Dialog open={isFullScreenOpen} onOpenChange={setIsFullScreenOpen}>
        <DialogContent className="max-w-screen-xl h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Image du Véhicule</DialogTitle>
            <DialogDescription>
              Visualisation en plein écran de l'image du véhicule.
            </DialogDescription>
          </DialogHeader>
          <div className="relative flex-grow overflow-auto flex items-center justify-center p-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Véhicule en plein écran"
                className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              />
            )}
          </div>
          <DialogFooter className="p-4 pt-0 flex justify-center gap-2">
            <Button onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
              <Minus className="h-4 w-4 mr-2" /> Zoom arrière
            </Button>
            <Button onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              <Plus className="h-4 w-4 mr-2" /> Zoom avant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VehicleDamageMarker;