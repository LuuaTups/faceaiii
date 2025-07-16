import { AnalysisResult } from '@/lib/types/analysis';
import axios from 'axios';
import { supabase } from '@/lib/config/supabase';
import { authService } from './auth';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function analyzeImage(imageUri: string): Promise<AnalysisResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file');
  }

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });

    const prompt = `You are a personal enhancement assistant. Analyze the visual elements focusing on styling balance, harmony, and composition.

Return strictly in JSON format. Be constructive and professional.

For each feature, provide:
- "rating": Score 1-10 (decimal, e.g., 7.4)
- "percent": Percentile rank 1-100%
- "keywords": One descriptive keyword
- "feedbackgood": What works well
- "feedbackbad": Areas for improvement
- "improvement1-4": Actionable suggestions
- "types": 2-5 category types

Analyze these features:
Eyebrows, Eyes, Nose, Lips, Face shape, Skin, Hair, Chin, Overall impression, Jawline, Cheekbones, Forehead

Return in this JSON format:
{
  "overallScore": number (7.0–9.8),
  "overallRating": "string",
  "features": [
    {
      "id": "string",
      "name": "string", 
      "description": "string",
      "score": number,
      "rating": "string",
      "color": "string",
      "icon": "string",
      "percent": number,
      "keywords": "string",
      "feedbackgood": "string",
      "feedbackbad": "string",
      "improvement1": "string",
      "improvement2": "string", 
      "improvement3": "string",
      "improvement4": "string",
      "types": ["string", "string"]
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "description": "string", 
      "category": "string",
      "color": "string"
    }
  ],
  "detailedBreakdown": {
    "Jawline": {
      "subcategories": [
        {"name": "Definition", "score": number, "color": "string"}
      ],
      "tips": [
        {"title": "string", "description": "string", "color": "string"}
      ]
    }
  }
}`;

    const apiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2500,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = apiResponse.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('Invalid response format from AI service');
    }
    
    const jsonString = content.substring(firstBrace, lastBrace + 1);
    const analysisResult = JSON.parse(jsonString);
    
    if (!analysisResult.overallScore || !analysisResult.features) {
      throw new Error('Invalid analysis result format');
    }

    // Save to database
    try {
      const currentUser = await authService.getCurrentUser();
      const { error } = await supabase
        .from('analyses')
        .insert([
          {
            user_id: currentUser?.id || null,
            image_uri: imageUri,
            overall_score: analysisResult.overallScore,
            overall_rating: analysisResult.overallRating,
            features: analysisResult.features,
            recommendations: analysisResult.recommendations,
            detailed_breakdown: analysisResult.detailedBreakdown,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Database save error:', error);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }
    
    return analysisResult as AnalysisResult;
  } catch (error) {
    console.error('Analysis error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}