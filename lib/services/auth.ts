import { supabase } from '@/lib/config/supabase';
import { User } from '@/lib/types/auth';

export const authService = {
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
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        }
        throw new Error(error.message || 'Failed to create account. Please try again.');
      }
      
      return data;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        }
        throw new Error(error.message || 'Failed to sign in. Please try again.');
      }
      
      return data;
    } catch (error: any) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error('Failed to sign out. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.message !== 'Auth session missing!') throw error;
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error && error.message !== 'Auth session missing!') throw error;
    return session;
  },

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