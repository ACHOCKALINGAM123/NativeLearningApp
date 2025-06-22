import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { SKILL_CATEGORIES, LANGUAGES, AUDIENCE_TYPES, SKILL_LEVELS, SESSION_TYPES, DELIVERY_MODES } from "@/lib/constants";
import MultiLocationSelector from "./multi-location-selector";

const skillSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  audienceType: z.string().min(1, "Audience type is required"),
  skillLevel: z.string().min(1, "Skill level is required"),
  teachingLanguage: z.string().min(1, "Teaching language is required"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  sessionTypes: z.array(z.string()).min(1, "Select at least one session type"),
  maxStudentsPerSession: z.number().min(1).max(20),
  deliveryModes: z.array(z.string()).min(1, "Select at least one delivery mode"),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface Location {
  country?: string;
  state?: string;
  city?: string;
}

interface SkillCreationFormProps {
  onSuccess?: () => void;
}

export default function SkillCreationForm({ onSuccess }: SkillCreationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [serviceLocations, setServiceLocations] = useState<Location[]>([]);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      audienceType: "",
      skillLevel: "",
      teachingLanguage: "",
      hourlyRate: "",
      sessionTypes: [],
      maxStudentsPerSession: 1,
      deliveryModes: ["online"],
    },
  });

  const watchedDeliveryModes = form.watch("deliveryModes");
  const includesInPerson = watchedDeliveryModes.includes("in_person");

  const onSubmit = async (data: SkillFormData) => {
    if (!user) return;

    // Prepare location arrays for database
    const availableCountries = serviceLocations.map(loc => loc.country).filter(Boolean);
    const availableStates = serviceLocations.map(loc => loc.state).filter(Boolean);
    const availableCities = serviceLocations.map(loc => loc.city).filter(Boolean);

    const skillData = {
      ...data,
      teacherId: user.id,
      hourlyRate: parseFloat(data.hourlyRate),
      availableCountries: [...new Set(availableCountries)], // Remove duplicates
      availableStates: [...new Set(availableStates)],
      availableCities: [...new Set(availableCities)],
    };

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/skills", "POST", skillData);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Skill created successfully",
        });
        form.reset();
        setServiceLocations([]);
        onSuccess?.();
      } else {
        throw new Error("Failed to create skill");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSessionType = (sessionType: string) => {
    const current = form.getValues("sessionTypes");
    const updated = current.includes(sessionType)
      ? current.filter(type => type !== sessionType)
      : [...current, sessionType];
    form.setValue("sessionTypes", updated);
  };

  const toggleDeliveryMode = (mode: string) => {
    const current = form.getValues("deliveryModes");
    const updated = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode];
    form.setValue("deliveryModes", updated);
  };

  if (!user || !user.isTeacher) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            You need to be registered as a teacher to create skills.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Skill</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Python Programming for Beginners" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="25.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what you'll teach and your teaching approach..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories and Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.emoji} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audienceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AUDIENCE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teachingLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.flag} {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudentsPerSession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Students per Session</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="20" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Session Types */}
            <FormField
              control={form.control}
              name="sessionTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Types</FormLabel>
                  <div className="space-y-3">
                    {SESSION_TYPES.map((sessionType) => (
                      <div key={sessionType.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={sessionType.id}
                          checked={field.value.includes(sessionType.id)}
                          onCheckedChange={() => toggleSessionType(sessionType.id)}
                        />
                        <label
                          htmlFor={sessionType.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {sessionType.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((sessionType) => {
                      const type = SESSION_TYPES.find(t => t.id === sessionType);
                      return type ? (
                        <Badge key={sessionType} variant="secondary">
                          {type.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delivery Modes */}
            <FormField
              control={form.control}
              name="deliveryModes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Modes</FormLabel>
                  <div className="space-y-3">
                    {DELIVERY_MODES.map((mode) => (
                      <div key={mode.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={mode.id}
                          checked={field.value.includes(mode.id)}
                          onCheckedChange={() => toggleDeliveryMode(mode.id)}
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
                    {field.value.map((mode) => {
                      const deliveryMode = DELIVERY_MODES.find(m => m.id === mode);
                      return deliveryMode ? (
                        <Badge key={mode} variant="secondary">
                          {deliveryMode.icon} {deliveryMode.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selector for In-Person Teaching */}
            {includesInPerson && (
              <MultiLocationSelector
                locations={serviceLocations}
                onLocationsChange={setServiceLocations}
                label="In-Person Teaching Locations"
                description="Add locations where you can teach in person"
              />
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Skill"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}