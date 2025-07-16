export interface AnalysisResult {
  overallScore: number;
  overallRating: string;
  features: FeatureAnalysis[];
  recommendations: Recommendation[];
  detailedBreakdown: DetailedBreakdown;
}

export interface FeatureAnalysis {
  id: string;
  name: string;
  description: string;
  score: number;
  rating: string;
  color: string;
  icon: string;
  percent?: number;
  keywords?: string;
  feedbackgood?: string;
  feedbackbad?: string;
  improvement1?: string;
  improvement2?: string;
  improvement3?: string;
  improvement4?: string;
  types?: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
}

export interface DetailedBreakdown {
  [featureName: string]: {
    subcategories: {
      name: string;
      score: number;
      color: string;
    }[];
    tips: {
      title: string;
      description: string;
      color: string;
    }[];
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUri: string;
  result: AnalysisResult;
}