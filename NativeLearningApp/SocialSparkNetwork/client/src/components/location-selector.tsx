import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { COUNTRIES, STATES_BY_COUNTRY } from "@/lib/constants";

interface LocationSelectorProps {
  country?: string;
  state?: string;
  city?: string;
  onLocationChange: (location: { country?: string; state?: string; city?: string }) => void;
  label?: string;
  required?: boolean;
}

export default function LocationSelector({
  country,
  state,
  city,
  onLocationChange,
  label = "Location",
  required = false
}: LocationSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState(country || "");
  const [selectedState, setSelectedState] = useState(state || "");
  const [selectedCity, setSelectedCity] = useState(city || "");

  const availableStates = selectedCountry ? STATES_BY_COUNTRY[selectedCountry] || [] : [];

  useEffect(() => {
    onLocationChange({
      country: selectedCountry || undefined,
      state: selectedState || undefined,
      city: selectedCity || undefined,
    });
  }, [selectedCountry, selectedState, selectedCity, onLocationChange]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedState("");
    setSelectedCity("");
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity("");
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="country" className="text-xs text-gray-600">Country</Label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="state" className="text-xs text-gray-600">State/Province</Label>
          <Select 
            value={selectedState} 
            onValueChange={handleStateChange}
            disabled={!selectedCountry || availableStates.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={availableStates.length === 0 ? "N/A" : "Select state"} />
            </SelectTrigger>
            <SelectContent>
              {availableStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city" className="text-xs text-gray-600">City</Label>
          <Input
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            placeholder="Enter city"
            disabled={!selectedCountry}
          />
        </div>
      </div>
    </div>
  );
}