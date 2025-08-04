import bcrypt from 'bcrypt';
import { db } from './database';
import { users } from './schema';
import { User, InsertUser, Login } from '@shared/schema';
import { eq } from 'drizzle-orm';

class AuthService {
  async registerUser(userData: InsertUser): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const existingEmail = await this.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(userData.password, saltRounds);

    // Insert user
    const result = await db.insert(users).values({
      username: userData.username,
      email: userData.email,
      password_hash
    }).returning();

    return result[0] as User;
  }

  async loginUser(credentials: Login): Promise<User> {
    const user = await this.getUserByUsername(credentials.username);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const result = await db.select().from(users).where(eq(users.id, id));
    
    if (result.length === 0) {
      throw new Error('User not found');
    }

    return result[0] as User;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? (result[0] as User) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? (result[0] as User) : null;
  }
}

export const authService = new AuthService();