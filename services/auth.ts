import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
        }
      });

      if (error) {
        // Handle specific signup errors
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (error.message.includes('Signup requires a valid password')) {
          throw new Error('Please enter a valid password.');
        }
        throw new Error(error.message || 'Failed to create account. Please try again.');
      }
      
      // Return signup data (may not have session if email confirmation required)
      return data;
      
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific signin errors
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        }
        if (error.message.includes('Email link is invalid or has expired')) {
          throw new Error('The email confirmation link has expired. Please request a new one.');
        }
        if (error.message.includes('Token has expired')) {
          throw new Error('Your session has expired. Please sign in again.');
        }
        if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        }
        if (error.message.includes('User not found')) {
          throw new Error('No account found with this email. Please sign up first.');
        }
        if (error.message.includes('Invalid credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        }
        throw new Error(error.message || 'Failed to sign in. Please try again.');
      }
      
      return data;
    } catch (error: any) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw new Error('Failed to sign out. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.message !== 'Auth session missing!') throw error;
    return user;
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error && error.message !== 'Auth session missing!') throw error;
    return session;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at!,
      } : null;
      callback(user);
    });
  }
};