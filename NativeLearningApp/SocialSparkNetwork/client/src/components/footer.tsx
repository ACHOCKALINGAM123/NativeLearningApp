import { GraduationCap } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary-400 mr-3" />
              <h3 className="text-xl font-bold">SkillShare Global</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting learners and teachers worldwide in their native languages.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Learners</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-white">
                  Find Teachers
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white">
                  Browse Skills
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">Book Sessions</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Student Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Teachers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/auth?tab=teacher" className="hover:text-white">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">Teacher Resources</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Pricing Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Teacher Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SkillShare Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
