# GitHub Setup Instructions for Native Learning App

## 🚀 Quick Start - Push to GitHub

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it: `native-learning-app` 
3. Set as **Public** or **Private** (your choice)
4. **Don't** initialize with README, .gitignore, or license (we have them)

### 2. Initialize Git and Push Code

```bash
# Navigate to the project directory
cd /workspace/NativeLearningApp-v2

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: Native Learning App with web & mobile support

✅ Features implemented:
- React Native + Expo with web compatibility
- Responsive design system (WebContainer, WebGrid, ResponsiveView)
- Web-optimized landing page with desktop layouts
- Web-only admin panel with sidebar navigation
- Cross-platform authentication with Supabase
- TypeScript throughout with proper type safety
- Beautiful UI components that adapt to platform

🌐 Platforms supported:
- Web (responsive desktop/mobile)
- iOS (React Native)
- Android (React Native)

🛠️ Tech stack:
- React Native + Expo
- TypeScript
- Supabase (auth, database)
- Stripe Connect (payments)
- NativeWind (TailwindCSS)
- Expo Router (navigation)"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/native-learning-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔧 GitHub Repository Setup

### 3. Configure Repository Settings

#### **Branch Protection (Recommended)**
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require pull request reviews

#### **Secrets Configuration**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### 4. Enable GitHub Actions

The repository includes `.github/workflows/ci.yml` which will:
- ✅ Test code on Node.js 18.x and 20.x
- ✅ Run TypeScript type checking
- ✅ Build web version for deployment
- ✅ Upload build artifacts

## 🌐 Deploy Web Version

### Option A: Vercel (Recommended)

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Choose `NativeLearningApp-v2` as root directory

2. **Configure Build Settings**:
   ```
   Framework Preset: Other
   Build Command: npm run build:web
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables** in Vercel dashboard:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Option B: Netlify

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Import from GitHub
   - Select your repository

2. **Build Settings**:
   ```
   Base directory: NativeLearningApp-v2
   Build command: npm run build:web
   Publish directory: NativeLearningApp-v2/dist
   ```

### Option C: GitHub Pages

1. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Source: **GitHub Actions**

2. **Add Deployment Workflow** (create `.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v3
           with:
             node-version: '20'
             cache: 'npm'
             cache-dependency-path: NativeLearningApp-v2/package-lock.json
         
         - name: Install and build
           working-directory: ./NativeLearningApp-v2
           run: |
             npm ci
             npm run build:web
         
         - name: Deploy to GitHub Pages
           uses: actions/deploy-pages@v2
           with:
             artifact_name: github-pages
             path: NativeLearningApp-v2/dist
   ```

## 📱 Mobile App Development

### EAS Build Setup (Expo Application Services)

1. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS** (in project directory):
   ```bash
   cd NativeLearningApp-v2
   eas build:configure
   ```

3. **Create Build**:
   ```bash
   # Development build
   eas build --platform all --profile development
   
   # Production build
   eas build --platform all --profile production
   ```

## 📋 Repository Structure

```
native-learning-app/
├── NativeLearningApp-v2/          # Main app directory
│   ├── app/                       # Expo Router pages
│   ├── components/                # Reusable components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries
│   ├── types/                     # TypeScript definitions
│   ├── constants/                 # App constants
│   └── ...
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── README.md                      # Main project documentation
├── IMPLEMENTATION_STATUS.md       # Development progress
└── WEB_IMPLEMENTATION.md          # Web-specific features
```

## 🔄 Development Workflow

### Recommended Git Flow

1. **Feature Development**:
   ```bash
   git checkout -b feature/course-creation
   # Make changes
   git add .
   git commit -m "✨ Add course creation functionality"
   git push origin feature/course-creation
   ```

2. **Create Pull Request**:
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Add description and request review

3. **After Review & Merge**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/course-creation
   ```

## 🏷️ Release Management

### Create Releases

```bash
# Tag a release
git tag -a v1.0.0 -m "🎉 Release v1.0.0: Initial production release"
git push origin v1.0.0
```

### GitHub Release Notes Template

```markdown
## 🎉 Version 1.0.0 - Initial Release

### ✨ New Features
- Cross-platform Native Learning App (Web + Mobile)
- Responsive design system with WebContainer components
- Web-only admin panel with desktop optimization
- Authentication system with Supabase integration
- Course exploration with advanced filtering

### 🌐 Platforms
- ✅ Web (responsive desktop/mobile)
- ✅ iOS (React Native)
- ✅ Android (React Native)

### 🛠️ Tech Stack
- React Native + Expo
- TypeScript
- Supabase
- Stripe Connect
- NativeWind (TailwindCSS)

### 📱 Download
- **Web App**: [Live Demo](https://your-app.vercel.app)
- **iOS**: Coming to App Store
- **Android**: Coming to Google Play
```

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for CI/CD
- ✅ Different environments (dev/staging/prod)

### Dependencies
- ✅ Regular security updates with `npm audit`
- ✅ Dependabot enabled for automatic updates
- ✅ Lock file committed for consistent builds

## 📊 Monitoring & Analytics

### Setup Recommendations
1. **Error Tracking**: Sentry for both web and mobile
2. **Analytics**: Google Analytics for web, native analytics for mobile
3. **Performance**: Web Vitals monitoring
4. **Uptime**: UptimeRobot for web app monitoring

## 🎯 Next Steps After GitHub Setup

1. **Set up external services** (Supabase, Stripe, OpenAI)
2. **Configure environment variables** in all platforms
3. **Complete feature implementation** (payments, AI chat, etc.)
4. **Set up monitoring and analytics**
5. **Launch beta testing** with real users

---

## 🚀 Quick Commands Reference

```bash
# Development
npm start              # Choose platform (web/iOS/Android)
npm run web           # Web development server
npm run android       # Android development
npm run ios           # iOS development (macOS only)

# Build & Deploy
npm run build:web     # Build web version
eas build --platform all  # Build mobile apps

# Git & GitHub
git add .
git commit -m "✨ New feature"
git push origin main
```

Your Native Learning App is now ready for GitHub! 🎉