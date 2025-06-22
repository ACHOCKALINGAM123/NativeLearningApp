import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">SkillShare Global</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-primary-600 font-medium">
              Browse Skills
            </Link>
            <Link href="/auth?tab=teacher" className="text-gray-700 hover:text-primary-600 font-medium">
              Become a Teacher
            </Link>
            <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium">
              How it Works
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Button>
                </Link>
                <span className="text-sm text-gray-600">
                  Hello, {user?.firstName}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="text-gray-700 border-gray-300"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="bg-primary-600 text-white hover:bg-primary-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/search">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Browse Skills
                </Button>
              </Link>
              <Link href="/auth?tab=teacher">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  Become a Teacher
                </Button>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button className="w-full justify-start bg-primary-600 text-white hover:bg-primary-700" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
