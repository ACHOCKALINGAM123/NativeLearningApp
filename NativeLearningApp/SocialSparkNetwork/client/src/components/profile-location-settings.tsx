import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import LocationSelector from "./location-selector";
import { DELIVERY_MODES } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

const profileLocationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  teachingPreferences: z.array(z.string()).min(1, "Select at least one teaching preference"),
});

type ProfileLocationFormData = z.infer<typeof profileLocationSchema>;

interface ProfileLocationSettingsProps {
  onUpdate?: () => void;
}

export default function ProfileLocationSettings({ onUpdate }: ProfileLocationSettingsProps) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileLocationFormData>({
    resolver: zodResolver(profileLocationSchema),
    defaultValues: {
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
      teachingPreferences: user?.teachingPreferences || ["online"],
    },
  });

  const handleLocationChange = (location: { country?: string; state?: string; city?: string }) => {
    if (location.country) form.setValue("country", location.country);
    if (location.state !== undefined) form.setValue("state", location.state);
    if (location.city !== undefined) form.setValue("city", location.city);
  };

  const onSubmit = async (data: ProfileLocationFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiRequest(`/api/users/${user.id}`, "PATCH", data);

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        toast({
          title: "Success",
          description: "Location and teaching preferences updated successfully",
        });
        onUpdate?.();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update location settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTeachingPreference = (mode: string) => {
    const current = form.getValues("teachingPreferences");
    const updated = current.includes(mode)
      ? current.filter(p => p !== mode)
      : [...current, mode];
    form.setValue("teachingPreferences", updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location & Teaching Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <LocationSelector
              country={form.watch("country")}
              state={form.watch("state")}
              city={form.watch("city")}
              onLocationChange={handleLocationChange}
              label="Your Location"
              required
            />

            <FormField
              control={form.control}
              name="teachingPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teaching Preferences</FormLabel>
                  <div className="space-y-3">
                    {DELIVERY_MODES.map((mode) => (
                      <div key={mode.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={mode.id}
                          checked={field.value.includes(mode.id)}
                          onCheckedChange={() => toggleTeachingPreference(mode.id)}
                        />
                        <label
                          htmlFor={mode.id}
                          className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span>{mode.icon}</span>
                          <span>{mode.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((preference) => {
                      const mode = DELIVERY_MODES.find(m => m.id === preference);
                      return mode ? (
                        <Badge key={preference} variant="secondary">
                          {mode.icon} {mode.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Location Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}