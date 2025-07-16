import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/services/auth';
import { User, AuthState } from '@/lib/types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
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
      
      if (result.user && !result.session) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return result;
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
      
      if (!result.user) {
        setAuthState(prev => ({ ...prev, loading: false }));
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