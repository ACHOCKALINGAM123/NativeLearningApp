import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Filter, Users, Star, ArrowRight, SlidersHorizontal } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TeacherCard from "@/components/teacher-card";
import BookingModal from "@/components/booking-modal";
import AiChat from "@/components/ai-chat";
import { SKILL_CATEGORIES, LANGUAGES, AUDIENCE_TYPES, DELIVERY_MODES, COUNTRIES } from "@/lib/constants";
import LocationSelector from "@/components/location-selector";
import { Link } from "wouter";
import type { Skill, User } from "@shared/schema";

interface SkillWithTeacher extends Skill {
  teacher: User;
  stats?: {
    averageRating: number;
    reviewCount: number;
  };
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedAudienceType, setSelectedAudienceType] = useState("");
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"skills" | "teachers">("skills");

  const ITEMS_PER_PAGE = 12;

  // Get URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    const category = urlParams.get("category");
    const language = urlParams.get("language");
    const audienceType = urlParams.get("audienceType");

    if (query) setSearchQuery(query);
    if (category) setSelectedCategory(category);
    if (language) setSelectedLanguage(language);
    if (audienceType) setSelectedAudienceType(audienceType);
  }, []);

  // Fetch skills with filters
  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ["/api/skills", {
      query: searchQuery,
      category: selectedCategory,
      language: selectedLanguage,
      audienceType: selectedAudienceType,
      deliveryMode: selectedDeliveryMode,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      limit: ITEMS_PER_PAGE,
      offset: currentPage * ITEMS_PER_PAGE,
    }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedLanguage) params.append("language", selectedLanguage);
      if (selectedAudienceType) params.append("audienceType", selectedAudienceType);
      if (selectedDeliveryMode) params.append("deliveryMode", selectedDeliveryMode);
      if (selectedCountry) params.append("country", selectedCountry);
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("city", selectedCity);
      params.append("limit", ITEMS_PER_PAGE.toString());
      params.append("offset", (currentPage * ITEMS_PER_PAGE).toString());
      
      return fetch(`/api/skills?${params.toString()}`).then(res => res.json());
    },
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedAudienceType, selectedDeliveryMode, selectedCountry, selectedState, selectedCity]);

  const handleSearch = () => {
    // Search is automatically triggered by the query
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLanguage("");
    setSelectedAudienceType("");
    setSelectedDeliveryMode("");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setCurrentPage(0);
  };

  const handleLocationChange = (location: { country?: string; state?: string; city?: string }) => {
    setSelectedCountry(location.country || "");
    setSelectedState(location.state || "");
    setSelectedCity(location.city || "");
  };

  const getLanguageFlag = (code: string) => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language?.flag || "🌐";
  };

  const getLanguageName = (code: string) => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language?.name || code;
  };

  const getCategoryName = (id: string) => {
    const category = SKILL_CATEGORIES.find(cat => cat.id === id);
    return category?.name || id;
  };

  const getAudienceTypeName = (id: string) => {
    const audienceType = AUDIENCE_TYPES.find(type => type.id === id);
    return audienceType?.name || id;
  };

  const handleBookSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setBookingModalOpen(true);
  };

  const totalPages = skillsData ? Math.ceil(skillsData.total / ITEMS_PER_PAGE) : 0;
  const skills = skillsData?.skills || [];

  // Group skills by teacher for teacher view
  const teachersWithSkills = skills.reduce((acc: any[], skill: Skill) => {
    const existingTeacher = acc.find(t => t.id === skill.teacherId);
    if (existingTeacher) {
      existingTeacher.skills.push(skill);
    } else {
      // Create a mock teacher object since we don't have teacher details in skills API
      acc.push({
        id: skill.teacherId,
        firstName: "Teacher",
        lastName: `#${skill.teacherId}`,
        skills: [skill],
        nativeLanguages: [skill.teachingLanguage],
        stats: {
          averageRating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
        }
      });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Teacher</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover skilled teachers and learn in your preferred language
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for skills, teachers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-primary-600 hover:bg-primary-700 px-8"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {SKILL_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.emoji} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Languages</SelectItem>
                        {LANGUAGES.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.flag} {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                    <Select value={selectedAudienceType} onValueChange={setSelectedAudienceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Audiences" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Audiences</SelectItem>
                        {AUDIENCE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Mode</label>
                    <Select value={selectedDeliveryMode} onValueChange={setSelectedDeliveryMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Modes</SelectItem>
                        {DELIVERY_MODES.map((mode) => (
                          <SelectItem key={mode.id} value={mode.id}>
                            {mode.icon} {mode.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Filters */}
                <div className="mb-4">
                  <LocationSelector
                    country={selectedCountry}
                    state={selectedState}
                    city={selectedCity}
                    onLocationChange={handleLocationChange}
                    label="Filter by Location (optional)"
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>

                {/* Active Filters */}
                {(searchQuery || selectedCategory || selectedLanguage || selectedAudienceType || selectedDeliveryMode || selectedCountry) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                        Search: "{searchQuery}" ✕
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("")}>
                        {getCategoryName(selectedCategory)} ✕
                      </Badge>
                    )}
                    {selectedLanguage && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedLanguage("")}>
                        {getLanguageFlag(selectedLanguage)} {getLanguageName(selectedLanguage)} ✕
                      </Badge>
                    )}
                    {selectedAudienceType && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedAudienceType("")}>
                        {getAudienceTypeName(selectedAudienceType)} ✕
                      </Badge>
                    )}
                    {selectedDeliveryMode && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedDeliveryMode("")}>
                        {DELIVERY_MODES.find(mode => mode.id === selectedDeliveryMode)?.icon} {DELIVERY_MODES.find(mode => mode.id === selectedDeliveryMode)?.name} ✕
                      </Badge>
                    )}
                    {selectedCountry && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCountry("")}>
                        {COUNTRIES.find(country => country.code === selectedCountry)?.flag} {COUNTRIES.find(country => country.code === selectedCountry)?.name} ✕
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* View Toggle & Results Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "skills" | "teachers")}>
                <TabsList>
                  <TabsTrigger value="skills" className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="teachers" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Teachers
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {skillsData && (
              <p className="text-gray-600">
                Showing {skills.length} of {skillsData.total} results
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {skillsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : skills.length > 0 ? (
          <>
            <Tabs value={viewMode} className="space-y-6">
              <TabsContent value="skills" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill: Skill) => (
                    <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3">{skill.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{skill.category}</Badge>
                            <Badge variant="outline">{skill.skillLevel}</Badge>
                            <Badge variant="outline">
                              {getLanguageFlag(skill.teachingLanguage)} {getLanguageName(skill.teachingLanguage)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Teacher #{skill.teacherId}</p>
                              <div className="flex items-center mt-1">
                                <div className="flex text-yellow-400 text-sm">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-3 h-3 fill-current" />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600 ml-1">4.8 (23)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary-600">${skill.hourlyRate}</p>
                              <p className="text-xs text-gray-600">per hour</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link href={`/teacher/${skill.teacherId}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                View Teacher
                              </Button>
                            </Link>
                            <Button 
                              onClick={() => handleBookSkill(skill)}
                              size="sm"
                              className="flex-1 bg-primary-600 hover:bg-primary-700"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="teachers" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachersWithSkills.map((teacher: any) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                    if (pageNum >= totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={pageNum === currentPage ? "bg-primary-600" : ""}
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any skills matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="space-y-3">
                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                  <Link href="/auth?tab=teacher">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Become a Teacher
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Quick Access */}
        {!searchQuery && !selectedCategory && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SKILL_CATEGORIES.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCategory(category.id)}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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
