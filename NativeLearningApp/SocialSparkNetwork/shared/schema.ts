import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  isTeacher: boolean("is_teacher").default(false),
  isLearner: boolean("is_learner").default(true),
  nativeLanguages: text("native_languages").array().notNull(),
  spokenLanguages: text("spoken_languages").array().notNull(),
  timezone: text("timezone").notNull(),
  country: text("country").notNull(),
  state: text("state"),
  city: text("city"),
  teachingPreferences: text("teaching_preferences").array().notNull().default([]), // ["online", "in_person"]
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  audienceType: text("audience_type").notNull(), // Students, University, Professionals, General
  skillLevel: text("skill_level").notNull(), // Beginner, Intermediate, Advanced
  teachingLanguage: text("teaching_language").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  sessionTypes: text("session_types").array().notNull(), // ["1-on-1", "group"]
  maxStudentsPerSession: integer("max_students_per_session").default(1),
  deliveryModes: text("delivery_modes").array().notNull().default(["online"]), // ["online", "in_person"]
  availableCountries: text("available_countries").array().notNull().default([]),
  availableStates: text("available_states").array().notNull().default([]),
  availableCities: text("available_cities").array().notNull().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  isActive: boolean("is_active").default(true),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  skillId: integer("skill_id").references(() => skills.id).notNull(),
  learnerId: integer("learner_id").references(() => users.id).notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  teacherEarnings: decimal("teacher_earnings", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  sessionLink: text("session_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  revieweeId: integer("reviewee_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  skillsAsTeacher: many(skills),
  bookingsAsLearner: many(bookings, { relationName: "learnerBookings" }),
  bookingsAsTeacher: many(bookings, { relationName: "teacherBookings" }),
  reviewsGiven: many(reviews, { relationName: "reviewsGiven" }),
  reviewsReceived: many(reviews, { relationName: "reviewsReceived" }),
  availability: many(availability),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  teacher: one(users, {
    fields: [skills.teacherId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  skill: one(skills, {
    fields: [bookings.skillId],
    references: [skills.id],
  }),
  learner: one(users, {
    fields: [bookings.learnerId],
    references: [users.id],
    relationName: "learnerBookings",
  }),
  teacher: one(users, {
    fields: [bookings.teacherId],
    references: [users.id],
    relationName: "teacherBookings",
  }),
  reviews: many(reviews),
  messages: many(messages),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewsGiven",
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: "reviewsReceived",
  }),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  teacher: one(users, {
    fields: [availability.teacherId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
