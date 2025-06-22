import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft, Clock, Calendar as CalendarIcon, User, DollarSign, Shield } from "lucide-react";
import { Link } from "wouter";
import { LANGUAGES } from "@/lib/constants";
import type { Skill, User as UserType } from "@shared/schema";

export default function Booking() {
  const [, params] = useRoute("/booking/:skillId");
  const [, navigate] = useLocation();
  const skillId = params?.skillId ? parseInt(params.skillId) : null;
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [sessionNotes, setSessionNotes] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Fetch skill details
  const { data: skill, isLoading: skillLoading } = useQuery({
    queryKey: ["/api/skills", skillId],
    queryFn: () => fetch(`/api/skills/${skillId}`).then(res => res.json()),
    enabled: !!skillId,
  });

  // Fetch teacher details
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ["/api/users", skill?.teacherId],
    queryFn: () => fetch(`/api/users/${skill?.teacherId}`).then(res => res.json()),
    enabled: !!skill?.teacherId,
  });

  // Fetch teacher availability
  const { data: availability } = useQuery({
    queryKey: ["/api/teachers", skill?.teacherId, "availability"],
    queryFn: () => fetch(`/api/teachers/${skill?.teacherId}/availability`).then(res => res.json()),
    enabled: !!skill?.teacherId,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Booking Confirmed!",
        description: "Your session has been booked successfully. You'll receive a confirmation email shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/learner"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!skill || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your session.",
        variant: "destructive",
      });
      return;
    }

    const sessionDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    sessionDateTime.setHours(hours, minutes);

    const totalAmount = parseFloat(skill.hourlyRate) * (duration / 60);

    createBookingMutation.mutate({
      skillId: skill.id,
      teacherId: skill.teacherId,
      sessionDate: sessionDateTime.toISOString(),
      duration,
      totalAmount: totalAmount.toString(),
      notes: sessionNotes,
      status: "pending",
    });
  };

  if (skillLoading || teacherLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!skill || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Skill Not Found</h1>
              <p className="text-gray-600 mb-6">The skill you're trying to book doesn't exist or is no longer available.</p>
              <Link href="/search">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Browse Other Skills
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getLanguageFlag = (code: string) => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language?.flag || "🌐";
  };

  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language?.name || code;
  };

  const availableTimes = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const hourlyRate = parseFloat(skill.hourlyRate);
  const sessionFee = hourlyRate * (duration / 60);
  const platformFee = sessionFee * 0.20;
  const total = sessionFee + platformFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/teacher/${teacher.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teacher Profile
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Session</h1>
          <p className="text-lg text-gray-600">Schedule your learning session with {teacher.firstName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            {/* Skill Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{skill.title}</h3>
                  <p className="text-gray-600">{skill.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{skill.category}</Badge>
                  <Badge variant="outline">{skill.audienceType}</Badge>
                  <Badge variant="outline">{skill.skillLevel}</Badge>
                  <Badge variant="outline">
                    {getLanguageFlag(skill.teachingLanguage)} {getLanguageName(skill.teachingLanguage)}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>Max {skill.maxStudentsPerSession} student{skill.maxStudentsPerSession > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{skill.sessionTypes?.join(", ")}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                    {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{teacher.firstName} {teacher.lastName}</p>
                    <p className="text-sm text-gray-600">
                      {teacher.nativeLanguages?.map(lang => `${getLanguageFlag(lang)} ${getLanguageName(lang)}`).join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Available Times</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "bg-primary-600 text-white" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Times shown in teacher's timezone ({teacher.timezone})
                  </p>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                    Session Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="30"
                    max="180"
                    step="30"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
                    Session Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Let your teacher know what you'd like to focus on in this session..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skill:</span>
                    <span className="font-medium">{skill.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teacher:</span>
                    <span className="font-medium">{teacher.firstName} {teacher.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{duration} minutes</span>
                  </div>
                  {selectedDate && selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">
                        {selectedDate.toLocaleDateString()} at {selectedTime}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session fee ({duration/60}h):</span>
                    <span>${sessionFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform fee (20%):</span>
                    <span>${platformFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Booking Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">Cancellation Policy</h4>
                  <p>Free cancellation up to 24 hours before the session. Later cancellations may incur charges.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Payment</h4>
                  <p>Payment is processed immediately upon booking confirmation. Refunds are issued according to our cancellation policy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Session Link</h4>
                  <p>You'll receive a video call link via email 30 minutes before your session starts.</p>
                </div>
              </CardContent>
            </Card>

            {/* Confirm Booking Button */}
            <Button 
              onClick={handleBooking}
              disabled={createBookingMutation.isPending || !selectedDate || !selectedTime}
              className="w-full bg-primary-600 text-white hover:bg-primary-700 py-3 text-lg"
            >
              {createBookingMutation.isPending ? "Processing..." : `Confirm Booking - $${total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By clicking "Confirm Booking", you agree to our Terms of Service and Privacy Policy.
              Your payment will be processed securely.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
