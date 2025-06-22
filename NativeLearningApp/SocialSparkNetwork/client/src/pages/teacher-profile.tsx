import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, Globe, Users, Calendar, MapPin } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookingModal from "@/components/booking-modal";
import AiChat from "@/components/ai-chat";
import { LANGUAGES } from "@/lib/constants";
import type { User, Skill, Review } from "@shared/schema";

interface TeacherWithDetails extends User {
  skills: Skill[];
  stats: {
    averageRating: number;
    reviewCount: number;
    totalSessions: number;
    totalEarnings: number;
  };
}

export default function TeacherProfile() {
  const [, params] = useRoute("/teacher/:id");
  const teacherId = params?.id ? parseInt(params.id) : null;
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch teacher details
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ["/api/users", teacherId],
    queryFn: () => fetch(`/api/users/${teacherId}`).then(res => res.json()),
    enabled: !!teacherId,
  });

  // Fetch teacher skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["/api/teachers", teacherId, "skills"],
    queryFn: () => fetch(`/api/teachers/${teacherId}/skills`).then(res => res.json()),
    enabled: !!teacherId,
  });

  // Fetch teacher stats
  const { data: stats } = useQuery({
    queryKey: ["/api/teachers", teacherId, "stats"],
    queryFn: () => fetch(`/api/teachers/${teacherId}/stats`).then(res => res.json()),
    enabled: !!teacherId,
  });

  // Fetch teacher reviews
  const { data: reviews } = useQuery({
    queryKey: ["/api/teachers", teacherId, "reviews"],
    queryFn: () => fetch(`/api/teachers/${teacherId}/reviews`).then(res => res.json()),
    enabled: !!teacherId,
  });

  // Fetch teacher availability
  const { data: availability } = useQuery({
    queryKey: ["/api/teachers", teacherId, "availability"],
    queryFn: () => fetch(`/api/teachers/${teacherId}/availability`).then(res => res.json()),
    enabled: !!teacherId,
  });

  const handleBookSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setBookingModalOpen(true);
  };

  if (teacherLoading || skillsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
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

  if (!teacher || !skills) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h1>
              <p className="text-gray-600">The teacher you're looking for doesn't exist or is no longer available.</p>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const averageRating = stats?.averageRating || 0;
  const reviewCount = stats?.reviewCount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teacher Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
                    {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {teacher.firstName} {teacher.lastName}
                    </h1>
                    
                    {teacher.bio && (
                      <p className="text-gray-600 mb-4">{teacher.bio}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <span>{teacher.nativeLanguages?.map(lang => `${getLanguageFlag(lang)} ${getLanguageName(lang)}`).join(", ")}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{teacher.timezone}</span>
                      </div>
                    </div>
                    
                    {averageRating > 0 && (
                      <div className="flex items-center mt-4">
                        <div className="flex text-yellow-400 mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-5 h-5 ${star <= averageRating ? 'fill-current' : ''}`} 
                            />
                          ))}
                        </div>
                        <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-600 ml-2">({reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Teaching */}
            <Tabs defaultValue="skills" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="skills">Skills & Rates</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="space-y-4">
                {skills.map((skill: Skill) => (
                  <Card key={skill.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{skill.title}</h3>
                          <p className="text-gray-600 mb-3">{skill.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">{skill.category}</Badge>
                            <Badge variant="outline">{skill.audienceType}</Badge>
                            <Badge variant="outline">{skill.skillLevel}</Badge>
                            <Badge variant="outline">
                              {getLanguageFlag(skill.teachingLanguage)} {getLanguageName(skill.teachingLanguage)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>Max {skill.maxStudentsPerSession} student{skill.maxStudentsPerSession > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{skill.sessionTypes?.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-3">
                          <div>
                            <p className="text-2xl font-bold text-primary-600">${skill.hourlyRate}</p>
                            <p className="text-sm text-gray-600">per hour</p>
                          </div>
                          <Button 
                            onClick={() => handleBookSkill(skill)}
                            className="bg-primary-600 hover:bg-primary-700"
                          >
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: Review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                            L
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : ''}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {formatDate(review.createdAt!)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-600">No reviews yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="availability" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    {availability && availability.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Weekly Availability</h3>
                        {availability.map((slot: any) => {
                          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                          return (
                            <div key={slot.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                              <span className="font-medium">{days[slot.dayOfWeek]}</span>
                              <span className="text-gray-600">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          );
                        })}
                        <p className="text-sm text-gray-600 mt-4">
                          Times shown in teacher's timezone ({teacher.timezone})
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No availability information provided.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold">{stats?.totalSessions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">{averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold">{reviewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">&lt; 1 hour</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Native Languages</h4>
                  <div className="space-y-1">
                    {teacher.nativeLanguages?.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <span>{getLanguageFlag(lang)}</span>
                        <span className="text-gray-700">{getLanguageName(lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Also Speaks</h4>
                  <div className="space-y-1">
                    {teacher.spokenLanguages?.filter(lang => !teacher.nativeLanguages?.includes(lang)).map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <span>{getLanguageFlag(lang)}</span>
                        <span className="text-gray-700">{getLanguageName(lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Ready to Start Learning?</h3>
                  <p className="text-gray-600 mb-4">
                    Book a session with {teacher.firstName} and start your learning journey today!
                  </p>
                  {skills.length > 0 && (
                    <Button 
                      onClick={() => handleBookSkill(skills[0])}
                      className="w-full bg-primary-600 hover:bg-primary-700"
                    >
                      Book Your First Session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <AiChat />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        skill={selectedSkill}
      />
    </div>
  );
}
