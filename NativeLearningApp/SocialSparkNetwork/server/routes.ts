import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSkillSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const {
        category,
        language,
        audienceType,
        query,
        limit = "20",
        offset = "0"
      } = req.query;

      const result = await storage.searchSkills({
        category: category as string,
        language: language as string,
        audienceType: audienceType as string,
        query: query as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/skills/:id", async (req, res) => {
    try {
      const skill = await storage.getSkill(parseInt(req.params.id));
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(skill);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/skills", authenticateToken, async (req: any, res) => {
    try {
      const skillData = insertSkillSchema.parse({
        ...req.body,
        teacherId: req.user.userId,
      });
      
      const skill = await storage.createSkill(skillData);
      res.status(201).json(skill);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/teachers/:id/skills", async (req, res) => {
    try {
      const skills = await storage.getSkillsByTeacher(parseInt(req.params.id));
      res.json(skills);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bookings routes
  app.post("/api/bookings", authenticateToken, async (req: any, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        learnerId: req.user.userId,
      });

      // Calculate platform fee (20%) and teacher earnings
      const totalAmount = parseFloat(bookingData.totalAmount as string);
      const platformFee = totalAmount * 0.20;
      const teacherEarnings = totalAmount - platformFee;

      const booking = await storage.createBooking({
        ...bookingData,
        platformFee: platformFee.toString(),
        teacherEarnings: teacherEarnings.toString(),
      });

      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bookings/learner", authenticateToken, async (req: any, res) => {
    try {
      const bookings = await storage.getBookingsByLearner(req.user.userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bookings/teacher", authenticateToken, async (req: any, res) => {
    try {
      const bookings = await storage.getBookingsByTeacher(req.user.userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id", authenticateToken, async (req: any, res) => {
    try {
      const booking = await storage.updateBooking(parseInt(req.params.id), req.body);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reviews routes
  app.post("/api/reviews", authenticateToken, async (req: any, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: req.user.userId,
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/teachers/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByTeacher(parseInt(req.params.id));
      res.json(reviews);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Teacher stats
  app.get("/api/teachers/:id/stats", async (req, res) => {
    try {
      const stats = await storage.getTeacherStats(parseInt(req.params.id));
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Availability routes
  app.get("/api/teachers/:id/availability", async (req, res) => {
    try {
      const availability = await storage.getTeacherAvailability(parseInt(req.params.id));
      res.json(availability);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Categories endpoint
  app.get("/api/categories", async (req, res) => {
    const categories = [
      { id: "programming", name: "Programming & Tech", emoji: "💻" },
      { id: "creative", name: "Creative & Design", emoji: "🎨" },
      { id: "academic", name: "Academic Subjects", emoji: "📚" },
      { id: "business", name: "Business & Finance", emoji: "💼" },
      { id: "languages", name: "Languages", emoji: "🗣️" },
      { id: "music", name: "Music & Arts", emoji: "🎵" },
      { id: "health", name: "Health & Fitness", emoji: "🏃" },
      { id: "life", name: "Life Skills", emoji: "🔧" },
    ];
    res.json(categories);
  });

  // Languages endpoint
  app.get("/api/languages", async (req, res) => {
    const languages = [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Spanish", flag: "🇪🇸" },
      { code: "zh", name: "Mandarin", flag: "🇨🇳" },
      { code: "fr", name: "French", flag: "🇫🇷" },
      { code: "de", name: "German", flag: "🇩🇪" },
      { code: "ja", name: "Japanese", flag: "🇯🇵" },
      { code: "ar", name: "Arabic", flag: "🇸🇦" },
      { code: "pt", name: "Portuguese", flag: "🇧🇷" },
      { code: "ru", name: "Russian", flag: "🇷🇺" },
      { code: "hi", name: "Hindi", flag: "🇮🇳" },
    ];
    res.json(languages);
  });

  const httpServer = createServer(app);
  return httpServer;
}
