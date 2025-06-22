import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import type { Skill } from "@shared/schema";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
}

export default function BookingModal({ isOpen, onClose, skill }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "18:00", "19:00", "20:00"
  ];

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your session has been booked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/learner"] });
      onClose();
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
      status: "pending",
    });
  };

  if (!skill) return null;

  const hourlyRate = parseFloat(skill.hourlyRate);
  const sessionFee = hourlyRate * (duration / 60);
  const platformFee = sessionFee * 0.20;
  const total = sessionFee + platformFee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
        </DialogHeader>
        
        {!isAuthenticated ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Please sign in to book a session.</p>
            <Link href="/auth">
              <Button className="bg-primary-600 text-white hover:bg-primary-700">
                Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1">Available Times</Label>
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
            </div>

            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="30"
                max="180"
                step="30"
              />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span>Session fee:</span>
                <span>${sessionFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform fee (20%):</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleBooking}
              disabled={createBookingMutation.isPending || !selectedDate || !selectedTime}
              className="w-full bg-primary-600 text-white hover:bg-primary-700"
            >
              {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
