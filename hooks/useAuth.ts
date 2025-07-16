import { useState, useEffect, useCallback } from 'react';
import { authService, User, AuthState } from '@/services/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await authService.getSession();
        const user = session?.user ? {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at!,
        } : null;
        
        setAuthState({ user, loading: false });
      } catch (error) {
        console.error('Error getting initial session:', error);
        setAuthState({ user: null, loading: false });
      }
    };

    getInitialSession();

    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setAuthState({ user, loading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const result = await authService.signUp(email, password);
      
      // If we have a user but no session, email confirmation is required
      if (result.user && !result.session) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return result;
      }
      
      // If we have both user and session, auto-login successful
      if (result.user && result.session) {
        // Auth state change will handle the loading state
        return result;
      }
      
      // No user returned
      if (!result.user) {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
      
      return result;
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const result = await authService.signIn(email, password);
      
      // If we have a user, the auth state change will handle the loading state
      if (!result.user) {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
      
      // If we have both user and session, we're logged in
      if (result.user && result.session) {
        // Auth state change will handle the loading state
        return result;
      }
      
      return result;
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
    signUp,
    signIn,
    signOut,
  };
}