import { 
  users, skills, bookings, reviews, availability, messages,
  type User, type InsertUser, type Skill, type InsertSkill,
  type Booking, type InsertBooking, type Review, type InsertReview,
  type Availability, type InsertAvailability, type Message, type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, like, or, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Skill methods
  getSkill(id: number): Promise<Skill | undefined>;
  getSkillsByTeacher(teacherId: number): Promise<Skill[]>;
  searchSkills(filters: {
    category?: string;
    language?: string;
    audienceType?: string;
    query?: string;
    country?: string;
    state?: string;
    city?: string;
    deliveryMode?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ skills: Skill[]; total: number }>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill>;

  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByLearner(learnerId: number): Promise<Booking[]>;
  getBookingsByTeacher(teacherId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking>;

  // Review methods
  getReviewsByTeacher(teacherId: number): Promise<Review[]>;
  getReviewsBySkill(skillId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Availability methods
  getTeacherAvailability(teacherId: number): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, updates: Partial<InsertAvailability>): Promise<Availability>;

  // Message methods
  getConversation(userId1: number, userId2: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Analytics methods
  getTeacherStats(teacherId: number): Promise<{
    totalEarnings: number;
    totalSessions: number;
    averageRating: number;
    reviewCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill || undefined;
  }

  async getSkillsByTeacher(teacherId: number): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.teacherId, teacherId));
  }

  async searchSkills(filters: {
    category?: string;
    language?: string;
    audienceType?: string;
    query?: string;
    country?: string;
    state?: string;
    city?: string;
    deliveryMode?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ skills: Skill[]; total: number }> {
    const conditions = [eq(skills.isActive, true)];

    if (filters.category) {
      conditions.push(eq(skills.category, filters.category));
    }
    if (filters.language) {
      conditions.push(eq(skills.teachingLanguage, filters.language));
    }
    if (filters.audienceType) {
      conditions.push(eq(skills.audienceType, filters.audienceType));
    }
    if (filters.query) {
      const queryCondition = or(
        like(skills.title, `%${filters.query}%`),
        like(skills.description, `%${filters.query}%`)
      );
      if (queryCondition) conditions.push(queryCondition);
    }
    
    // Location-based filtering - show skills that either match the location or have no location restrictions
    if (filters.country) {
      conditions.push(
        sql`(${skills.availableCountries} @> ARRAY[${filters.country}]::text[] OR array_length(${skills.availableCountries}, 1) IS NULL)`
      );
    }
    
    if (filters.state) {
      conditions.push(
        sql`(${skills.availableStates} @> ARRAY[${filters.state}]::text[] OR array_length(${skills.availableStates}, 1) IS NULL)`
      );
    }
    
    if (filters.city) {
      conditions.push(
        sql`(${skills.availableCities} @> ARRAY[${filters.city}]::text[] OR array_length(${skills.availableCities}, 1) IS NULL)`
      );
    }
    
    // Delivery mode filtering
    if (filters.deliveryMode) {
      conditions.push(sql`${skills.deliveryModes} @> ARRAY[${filters.deliveryMode}]::text[]`);
    }

    const whereCondition = and(...conditions);
    
    // Execute queries with proper typing
    const skillQuery = db.select().from(skills).where(whereCondition).orderBy(desc(skills.createdAt));
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(skills).where(whereCondition);

    let finalQuery = skillQuery;
    if (filters.limit) {
      finalQuery = finalQuery.limit(filters.limit);
    }
    if (filters.offset) {
      finalQuery = finalQuery.offset(filters.offset);
    }

    const [skillResults, countResults] = await Promise.all([
      finalQuery,
      countQuery
    ]);

    return {
      skills: skillResults,
      total: Number(countResults[0]?.count) || 0
    };
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async updateSkill(id: number, updates: Partial<InsertSkill>): Promise<Skill> {
    const [skill] = await db
      .update(skills)
      .set(updates)
      .where(eq(skills.id, id))
      .returning();
    return skill;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByLearner(learnerId: number): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.learnerId, learnerId))
      .orderBy(desc(bookings.sessionDate));
  }

  async getBookingsByTeacher(teacherId: number): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.teacherId, teacherId))
      .orderBy(desc(bookings.sessionDate));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async getReviewsByTeacher(teacherId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.revieweeId, teacherId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsBySkill(skillId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .innerJoin(bookings, eq(reviews.bookingId, bookings.id))
      .where(eq(bookings.skillId, skillId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getTeacherAvailability(teacherId: number): Promise<Availability[]> {
    return await db.select().from(availability)
      .where(and(eq(availability.teacherId, teacherId), eq(availability.isActive, true)))
      .orderBy(asc(availability.dayOfWeek), asc(availability.startTime));
  }

  async createAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const [newAvailability] = await db
      .insert(availability)
      .values(availabilityData)
      .returning();
    return newAvailability;
  }

  async updateAvailability(id: number, updates: Partial<InsertAvailability>): Promise<Availability> {
    const [availabilityData] = await db
      .update(availability)
      .set(updates)
      .where(eq(availability.id, id))
      .returning();
    return availabilityData;
  }

  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getTeacherStats(teacherId: number): Promise<{
    totalEarnings: number;
    totalSessions: number;
    averageRating: number;
    reviewCount: number;
  }> {
    const [earningsResult] = await db
      .select({
        totalEarnings: sql<number>`COALESCE(SUM(${bookings.teacherEarnings}), 0)`,
        totalSessions: sql<number>`COUNT(${bookings.id})`
      })
      .from(bookings)
      .where(and(eq(bookings.teacherId, teacherId), eq(bookings.status, "completed")));

    const [ratingsResult] = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`
      })
      .from(reviews)
      .where(eq(reviews.revieweeId, teacherId));

    return {
      totalEarnings: Number(earningsResult.totalEarnings) || 0,
      totalSessions: Number(earningsResult.totalSessions) || 0,
      averageRating: Number(ratingsResult.averageRating) || 0,
      reviewCount: Number(ratingsResult.reviewCount) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
