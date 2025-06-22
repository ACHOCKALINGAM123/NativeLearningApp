import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@shared/schema";

interface TeacherCardProps {
  teacher: User & {
    skills?: Array<{
      id: number;
      title: string;
      hourlyRate: string;
    }>;
    stats?: {
      averageRating: number;
      reviewCount: number;
    };
  };
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const primarySkill = teacher.skills?.[0];
  const rating = teacher.stats?.averageRating || 0;
  const reviewCount = teacher.stats?.reviewCount || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
            {teacher.firstName?.[0]}{teacher.lastName?.[0]}
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {teacher.firstName} {teacher.lastName}
          </h3>
          
          {primarySkill && (
            <p className="text-gray-600 mb-2">{primarySkill.title}</p>
          )}
          
          <p className="text-sm text-gray-500 mb-3">
            {teacher.nativeLanguages?.map((lang, index) => (
              <span key={lang}>
                🌐 Native {lang}
                {index < (teacher.nativeLanguages?.length || 0) - 1 && " • "}
              </span>
            ))}
          </p>
          
          {rating > 0 && (
            <div className="flex items-center justify-center mb-3">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= rating ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}
          
          {primarySkill && (
            <p className="text-lg font-semibold text-primary-600 mb-4">
              ${primarySkill.hourlyRate}/hour
            </p>
          )}
          
          <Link href={`/teacher/${teacher.id}`}>
            <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
