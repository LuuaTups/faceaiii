import { useState, useCallback } from 'react';
import { AnalysisResult, HistoryItem } from '@/types/analysis';
import { analyzeImage } from '@/services/openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { authService } from '@/services/auth';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const HISTORY_KEY = 'analysis_history';

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  const saveToHistory = useCallback(async (imageUri: string, result: AnalysisResult) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUri,
        result
      };

      setHistory(prevHistory => {
        const updatedHistory = [newItem, ...prevHistory].slice(0, 50);
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  }, []);

  const getLatestAnalysis = useCallback(async () => {
    try {
      console.log('Fetching latest analysis from Supabase...');
      
      // Get current user (if any)
      const currentUser = await authService.getCurrentUser();
      let query = supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      // If user is logged in, filter by user_id, otherwise get analyses where user_id is null
      if (currentUser) {
        query = query.eq('user_id', currentUser.id);
      } else {
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query
        .single();

      if (error) {
        console.error('Supabase select error:', error);
        
        if (error.code === 'PGRST116') {
          console.log('No analysis results found in database');
          return null;
        }
        
        throw error;
      }

      console.log('Retrieved analysis data:', data);
      
      // Convert database format to AnalysisResult format
      const result: AnalysisResult = {
        overallScore: data.overall_score,
        overallRating: data.overall_rating,
        features: data.features,
        recommendations: data.recommendations,
        detailedBreakdown: data.detailed_breakdown
      };
      
      return result;
    } catch (error) {
      console.error('Error fetching latest analysis:', error);
      return null;
    }
  }, []);

  const analyzePhoto = useCallback(async (imageUri: string) => {
    let progressInterval: NodeJS.Timeout;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    
    console.log('Starting analysis for image:', imageUri);

    try {
      // Simulate progress updates
      progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await analyzeImage(imageUri);
      
      console.log('Analysis completed:', result);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setCurrentResult(result);
      await saveToHistory(imageUri, result);
      
      console.log('Current result set to:', result);
      console.log('Analysis state updated successfully');
      
      return result;
    } catch (err) {
      console.error('Analysis failed:', err);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [saveToHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }, []);

  return {
    isAnalyzing,
    analysisProgress,
    currentResult,
    history,
    error,
    analyzePhoto,
    loadHistory,
    clearHistory,
    setCurrentResult,
    getLatestAnalysis
  };
}