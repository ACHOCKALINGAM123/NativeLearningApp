export const SKILL_CATEGORIES = [
  {
    id: 'programming',
    name: 'Programming & Tech',
    icon: '💻',
    subcategories: [
      'Python',
      'JavaScript',
      'Java',
      'React',
      'Node.js',
      'Machine Learning',
      'Data Science',
      'DevOps',
      'Mobile Development',
      'Web Development',
      'Game Development',
      'Cybersecurity'
    ]
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: '💼',
    subcategories: [
      'Excel',
      'Project Management',
      'Accounting',
      'Marketing',
      'Sales',
      'Leadership',
      'Entrepreneurship',
      'Financial Analysis',
      'Business Strategy',
      'E-commerce'
    ]
  },
  {
    id: 'design',
    name: 'Design & Creative',
    icon: '🎨',
    subcategories: [
      'Graphic Design',
      'UI/UX Design',
      'Video Editing',
      'Photography',
      'Animation',
      'Digital Art',
      'Music Production',
      'Writing',
      'Content Creation',
      'Branding'
    ]
  },
  {
    id: 'academic',
    name: 'Academic Subjects',
    icon: '📚',
    subcategories: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'History',
      'Literature',
      'Geography',
      'Economics',
      'Psychology',
      'Philosophy'
    ]
  },
  {
    id: 'languages',
    name: 'Language Learning',
    icon: '🗣️',
    subcategories: [
      'English',
      'Spanish',
      'French',
      'German',
      'Chinese',
      'Japanese',
      'Italian',
      'Portuguese',
      'Arabic',
      'Russian'
    ]
  },
  {
    id: 'personal',
    name: 'Personal Development',
    icon: '🌱',
    subcategories: [
      'Communication Skills',
      'Public Speaking',
      'Time Management',
      'Goal Setting',
      'Productivity',
      'Mindfulness',
      'Confidence Building',
      'Interview Skills',
      'Resume Writing',
      'Career Coaching'
    ]
  }
] as const

export const AUDIENCE_TYPES = [
  { value: 'students', label: 'Students (GCSE, A-Level, High School)' },
  { value: 'university', label: 'University Students' },
  { value: 'professionals', label: 'Working Professionals' },
  { value: 'general', label: 'General Learners & Hobbyists' }
] as const

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Little to no experience' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience and basic knowledge' },
  { value: 'advanced', label: 'Advanced', description: 'Extensive experience and expertise' }
] as const

export const SESSION_TYPES = [
  { value: 'hourly', label: 'Hourly Mentoring', description: 'Live 1:1 or group sessions' },
  { value: 'self_paced', label: 'Self-Paced Course', description: 'Pre-recorded content for independent learning' },
  { value: 'career_path', label: 'Career Path', description: 'Structured learning journey with multiple courses' }
] as const

export const PLATFORM_FEE_PERCENTAGE = 20

export const DEFAULT_TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'America/Sao_Paulo',
  'Africa/Cairo'
] as const