import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TeacherCard from "@/components/teacher-card";
import BookingModal from "@/components/booking-modal";
import AiChat from "@/components/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, UserCheck, ArrowRight } from "lucide-react";
import { SKILL_CATEGORIES, LANGUAGES } from "@/lib/constants";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch skills for featured teachers (limiting to 3)
  const { data: skillsData } = useQuery({
    queryKey: ["/api/skills", { limit: 6 }],
    queryFn: () => fetch("/api/skills?limit=6").then(res => res.json()),
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="primary-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn & Teach Skills in{" "}
              <span className="text-primary-600">Your Native Language</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with teachers and learners worldwide. Share knowledge, learn new skills, 
              and grow together in a platform that celebrates cultural diversity.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What skill do you want to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <Button 
                  onClick={handleSearch}
                  className="absolute right-2 top-2 bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700">
                  Find a Teacher
                </Button>
              </Link>
              <Link href="/auth?tab=teacher">
                <Button variant="outline" className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50">
                  Start Teaching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Skill Categories</h2>
            <p className="text-lg text-gray-600">Discover skills across different areas and expertise levels</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SKILL_CATEGORIES.map((category) => (
              <Link key={category.id} href={`/search?category=${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {category.emoji}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">Browse teachers</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Teachers</h2>
            <p className="text-lg text-gray-600">Learn from experienced professionals in their native languages</p>
          </div>

          {skillsData?.skills && skillsData.skills.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skillsData.skills.slice(0, 3).map((skill: any) => (
                  <div key={skill.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                        TS
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">Skilled Teacher</h3>
                      <p className="text-gray-600 mb-2">{skill.title}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        🌐 {skill.teachingLanguage}
                      </p>
                      
                      <div className="flex items-center justify-center mb-3">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>⭐</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">5.0 (New)</span>
                      </div>
                      
                      <p className="text-lg font-semibold text-primary-600 mb-4">
                        ${skill.hourlyRate}/hour
                      </p>
                      
                      <Button 
                        onClick={() => {
                          setSelectedSkill(skill);
                          setBookingModalOpen(true);
                        }}
                        className="w-full bg-primary-600 text-white hover:bg-primary-700"
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/search">
                  <Button variant="outline" className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50">
                    View All Teachers
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No teachers available yet.</p>
              <Link href="/auth?tab=teacher">
                <Button className="bg-primary-600 text-white hover:bg-primary-700">
                  Be the First Teacher
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SkillShare Global Works</h2>
            <p className="text-lg text-gray-600">Simple steps to start learning or teaching</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Learners */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="text-primary-600 mr-3" />
                For Learners
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Search & Discover</h4>
                    <p className="text-gray-600">Browse skills by category, language, and experience level</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Book a Session</h4>
                    <p className="text-gray-600">Choose your preferred teacher and schedule a session</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Learn & Grow</h4>
                    <p className="text-gray-600">Attend live sessions and practice new skills</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Teachers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserCheck className="text-emerald-600 mr-3" />
                For Teachers
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Create Profile</h4>
                    <p className="text-gray-600">Set up your profile and list your skills in your native language</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Set Your Rates</h4>
                    <p className="text-gray-600">Choose your hourly rates and availability</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Start Teaching</h4>
                    <p className="text-gray-600">Accept bookings and earn 80% of session fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Language Support</h2>
            <p className="text-lg text-gray-600">Learn and teach in 50+ languages worldwide</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {LANGUAGES.slice(0, 10).map((language) => (
              <Link key={language.code} href={`/search?language=${language.code}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">{language.flag}</div>
                    <p className="font-medium text-gray-900">{language.name}</p>
                    <p className="text-sm text-gray-600">Browse teachers</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/search">
              <Button variant="ghost" className="text-primary-600 hover:text-primary-700">
                View all supported languages <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
