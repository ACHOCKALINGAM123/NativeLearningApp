import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LocationSelector from "./location-selector";
import { COUNTRIES } from "@/lib/constants";

interface Location {
  country?: string;
  state?: string;
  city?: string;
}

interface MultiLocationSelectorProps {
  locations: Location[];
  onLocationsChange: (locations: Location[]) => void;
  label?: string;
  description?: string;
}

export default function MultiLocationSelector({
  locations,
  onLocationsChange,
  label = "Service Areas",
  description = "Add locations where you can teach in person"
}: MultiLocationSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const addLocation = (location: Location) => {
    if (location.country) {
      onLocationsChange([...locations, location]);
      setShowAddForm(false);
    }
  };

  const removeLocation = (index: number) => {
    onLocationsChange(locations.filter((_, i) => i !== index));
  };

  const getLocationDisplay = (location: Location) => {
    const country = COUNTRIES.find(c => c.code === location.country);
    const parts = [];
    
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (country) parts.push(country.name);
    
    return parts.join(", ");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Existing locations */}
      {locations.length > 0 && (
        <div className="space-y-2">
          {locations.map((location, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center justify-between px-3 py-2 text-sm w-fit"
            >
              <span>{getLocationDisplay(location)}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-1 ml-2"
                onClick={() => removeLocation(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add new location */}
      {showAddForm ? (
        <Card>
          <CardContent className="pt-4">
            <LocationSelector
              onLocationChange={addLocation}
              label="Add Location"
            />
            <div className="flex space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Location</span>
        </Button>
      )}

      {locations.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No locations added. Teaching will be available online only.
        </p>
      )}
    </div>
  );
}