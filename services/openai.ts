import { AnalysisResult } from '@/types/analysis';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { authService } from './auth';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function analyzeImage(imageUri: string): Promise<AnalysisResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file');
  }

  try {
    // Convert image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.readAsDataURL(blob);
    });

    const prompt = `You are a personal enhancement assistant. Your task is to analyze the visual elements of the person in the image, focusing on styling balance, harmony, and visual composition.

Return the response strictly in JSON format. Avoid giving any personal judgment or implying attractiveness. Focus on styling, proportion, symmetry, and general composition balance. Your tone should be constructive, professional, and advisory, as if helping someone prepare for a public-facing role such as acting, modeling, or professional branding.

For each visual element, provide the following:

"rating": A score from 1 to 10 (always a decimal, e.g., 7.4 or 8.6), representing the stylistic balance of that feature—not attractiveness.

"percent": A stylistic percentile rank (1–100%) based on global style harmony data. Avoid round numbers ending in 0 or 5.

"keywords": One keyword that captures the styling or structural trait of this element (e.g., for hair: "curly", for skin: "radiant").

"feedbackgood": What works well or is well-balanced in this element.

"feedbackbad": What could potentially be better styled, enhanced, or balanced.

"improvement1–4": Four optional and actionable suggestions that could improve styling or perceived symmetry. These can include grooming, lighting, camera angles, product types, or general care advice.

"types": 2–5 general category types this feature might fall into (e.g., for nose: ["button", "straight", "aquiline"]).

Return these for the following categories:

Eyebrows

Eyes (Choose from: Almond, Round, Downturned, Upturned, Monolid)

Nose

Lips

Face shape (Choose from: Square, Round, Diamond, Oval, Heart, Rectangular)

Skin

Hair

Chin

Overall impression

Jawline

Cheekbones

Forehead

🧾 Return the results using this strict JSON format, CRITICAL THAT YOU PROVIDE FEEDBACK FOR EVERY 12 FEATUREs:
{
  "overallScore": number (7.0–9.8),
  "overallRating": "string",
  "features": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "score": number (decimal),
      "rating": "string",
      "color": "string (hex)",
      "icon": "string (lucide icon)",
      "percent": number (1–100),
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
        {"name": "Definition", "score": number, "color": "string"},
        {"name": "Symmetry", "score": number, "color": "string"},
        {"name": "Proportion", "score": number, "color": "string"}
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
              {
                type: 'text',
                text: prompt
              },
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

    const data = apiResponse.data;
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    // Check for OpenAI refusal message
    if (content.toLowerCase().includes("i can't analyze") || 
        content.toLowerCase().includes("i'm sorry") || 
        content.toLowerCase().includes("i cannot") ||
        content.toLowerCase().includes("beauty assessment")) {
      throw new Error('AI analysis is currently unavailable for facial images due to policy restrictions. Please try again later or contact support.');
    }

    // Parse JSON response
    try {
      // Extract JSON portion from the response content
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        console.error('AI Response content:', content);
        throw new Error('The AI service returned an unexpected response format. Please try again.');
      }
      
      const jsonString = content.substring(firstBrace, lastBrace + 1);
      console.log('Extracted JSON:', jsonString);
      
      const analysisResult = JSON.parse(jsonString);
      
      // Validate the response structure
      if (!analysisResult.overallScore || !analysisResult.features || !Array.isArray(analysisResult.features)) {
        console.error('Invalid analysis result structure:', analysisResult);
        throw new Error('Invalid analysis result format received from AI service.');
      }
      
      // Save to Supabase
      try {
        console.log('Attempting to save to Supabase...');
        
        // Get current user (if any)
        const currentUser = await authService.getCurrentUser();
        const userId = currentUser?.id || null;
        
        const { data, error } = await supabase
          .from('analyses')
          .insert([
            {
              user_id: userId,
              image_uri: imageUri,
              overall_score: analysisResult.overallScore,
              overall_rating: analysisResult.overallRating,
              features: analysisResult.features,
              recommendations: analysisResult.recommendations,
              detailed_breakdown: analysisResult.detailedBreakdown,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          // Don't throw here, just log - we can still return the result
        } else {
          console.log('Analysis saved to Supabase:', data);
        }
      } catch (supabaseError) {
        console.error('Failed to save to Supabase (catch block):', supabaseError);
        // Continue without throwing - analysis can still work without DB
      }
      
      return analysisResult as AnalysisResult;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      if (content.toLowerCase().includes("policy") || content.toLowerCase().includes("guidelines")) {
        throw new Error('AI analysis is temporarily unavailable due to service policies. Please try again later.');
      }
      throw new Error('Unable to process the AI analysis response. Please try taking another photo.');
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Handle axios errors specifically
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new Error(`OpenAI API error: ${errorMessage}`);
    }
    
    throw error;
  }
}