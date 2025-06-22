import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, DollarSign, Star, Users, BookOpen, Plus } from "lucide-react";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's bookings as learner
  const { data: learnerBookings } = useQuery({
    queryKey: ["/api/bookings/learner"],
    queryFn: () => 
      fetch("/api/bookings/learner", {
        headers: getAuthHeaders(),
        credentials: "include",
      }).then(res => res.json()),
    enabled: isAuthenticated,
  });

  // Fetch user's bookings as teacher
  const { data: teacherBookings } = useQuery({
    queryKey: ["/api/bookings/teacher"],
    queryFn: () => 
      fetch("/api/bookings/teacher", {
        headers: getAuthHeaders(),
        credentials: "include",
      }).then(res => res.json()),
    enabled: isAuthenticated && user?.isTeacher,
  });

  // Fetch user's skills (if teacher)
  const { data: teacherSkills } = useQuery({
    queryKey: ["/api/teachers", user?.id, "skills"],
    queryFn: () => 
      fetch(`/api/teachers/${user?.id}/skills`, {
        headers: getAuthHeaders(),
        credentials: "include",
      }).then(res => res.json()),
    enabled: isAuthenticated && user?.isTeacher && user?.id,
  });

  // Fetch teacher stats
  const { data: teacherStats } = useQuery({
    queryKey: ["/api/teachers", user?.id, "stats"],
    queryFn: () => 
      fetch(`/api/teachers/${user?.id}/stats`, {
        headers: getAuthHeaders(),
        credentials: "include",
      }).then(res => res.json()),
    enabled: isAuthenticated && user?.isTeacher && user?.id,
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your learning journey and teaching opportunities
          </p>
        </div>

        {user.isTeacher ? (
          <Tabs defaultValue="teacher" className="space-y-6">
            <TabsList>
              <TabsTrigger value="teacher">Teacher Dashboard</TabsTrigger>
              <TabsTrigger value="learner">Learning Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="teacher" className="space-y-6">
              {/* Teacher Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${teacherStats?.totalEarnings?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {teacherStats?.totalSessions || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {teacherStats?.averageRating?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Skills</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {teacherSkills?.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Skills</CardTitle>
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  {teacherSkills && teacherSkills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teacherSkills.map((skill: any) => (
                        <Card key={skill.id} className="border">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{skill.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{skill.category}</p>
                            <p className="text-primary-600 font-semibold">
                              ${skill.hourlyRate}/hour
                            </p>
                            <Badge className={skill.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {skill.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't listed any skills yet.</p>
                      <Button className="bg-primary-600 hover:bg-primary-700">
                        List Your First Skill
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teaching Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Teaching Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {teacherBookings && teacherBookings.length > 0 ? (
                    <div className="space-y-4">
                      {teacherBookings
                        .filter((booking: any) => new Date(booking.sessionDate) > new Date())
                        .slice(0, 5)
                        .map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">Session #{booking.id}</p>
                            <p className="text-gray-600">{formatDate(booking.sessionDate)}</p>
                            <p className="text-sm text-gray-500">{booking.duration} minutes</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              +${booking.teacherEarnings}
                            </p>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No upcoming teaching sessions.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learner" className="space-y-6">
              {/* Learning Progress - this would be the same as the learner-only dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {learnerBookings && learnerBookings.length > 0 ? (
                    <div className="space-y-4">
                      {learnerBookings.slice(0, 5).map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">Session #{booking.id}</p>
                            <p className="text-gray-600">{formatDate(booking.sessionDate)}</p>
                            <p className="text-sm text-gray-500">{booking.duration} minutes</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary-600">
                              ${booking.totalAmount}
                            </p>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't booked any sessions yet.</p>
                      <Link href="/search">
                        <Button className="bg-primary-600 hover:bg-primary-700">
                          Find a Teacher
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          /* Learner-only Dashboard */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Your Learning Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {learnerBookings && learnerBookings.length > 0 ? (
                  <div className="space-y-4">
                    {learnerBookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">Session #{booking.id}</p>
                          <p className="text-gray-600">{formatDate(booking.sessionDate)}</p>
                          <p className="text-sm text-gray-500">{booking.duration} minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">
                            ${booking.totalAmount}
                          </p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't booked any sessions yet.</p>
                    <Link href="/search">
                      <Button className="bg-primary-600 hover:bg-primary-700">
                        Find a Teacher
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Want to share your skills?</h3>
                  <p className="text-gray-600 mb-4">
                    Become a teacher and earn money by sharing your expertise with learners worldwide.
                  </p>
                  <Link href="/auth?tab=teacher">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Become a Teacher
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
