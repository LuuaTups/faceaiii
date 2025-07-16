import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Share, Eye, Zap, User, ArrowDown, Heart, Sparkles, Lock } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useAnalysis } from '@/hooks/useAnalysis';
import Svg, { Circle } from 'react-native-svg';

const featureEmojis: { [key: string]: string } = {
  'Eyebrows': '🤨',
  'Eyes': '👁️',
  'Nose': '👃',
  'Lips': '👄',
  'Face shape': '🔷',
  'Skin': '✨',
  'Hair': '💇',
  'Chin': '🫵',
  'Overall impression': '🌟',
  'Jawline': '💪',
  'Cheekbones': '💎',
  'Forehead': '🧠',
};

const iconMap: { [key: string]: any } = {
  'eye': Eye,
  'zap': Zap,
  'user': User,
  'arrow-down': ArrowDown,
  'heart': Heart,
  'sparkles': Sparkles,
};

export default function ResultsScreen() {
  const { currentResult, loadHistory, getLatestAnalysis, setCurrentResult } = useAnalysis();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Results screen loaded, current result:', currentResult);
    
    // If no current result, try to fetch the latest from database
    if (!currentResult) {
      console.log('No current result, fetching latest from database...');
      setIsLoading(true);
      getLatestAnalysis().then((latestResult) => {
        if (latestResult) {
          console.log('Setting current result from database:', latestResult);
          setCurrentResult(latestResult);
        } else {
          console.log('No latest result found in database');
        }
        setIsLoading(false);
      }).catch((error) => {
        console.error('Failed to fetch latest analysis:', error);
        setIsLoading(false);
      });
    }
    
    loadHistory();
  }, [currentResult, loadHistory, getLatestAnalysis, setCurrentResult]);

  useEffect(() => {
    console.log('Current result changed:', currentResult);
  }, [currentResult]);

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FF88" />
            <Text style={styles.loadingText}>Loading analysis results...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!currentResult) {
    console.log('No current result found');
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FF88" />
            <Text style={styles.loadingText}>Loading analysis data...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#00FF88'; // Bright green for excellent
    if (score >= 8.0) return '#44FF44'; // Green for very good
    if (score >= 7.5) return '#88FF00'; // Yellow-green for good
    if (score >= 7.0) return '#FFAA00'; // Orange for average
    return '#FF6644'; // Red-orange for below average
  };

  const getProgressColors = (score: number) => {
    if (score >= 8.5) return ['#00FF88', '#00CC66'];
    if (score >= 8.0) return ['#44FF44', '#22CC22'];
    if (score >= 7.5) return ['#88FF00', '#66CC00'];
    if (score >= 7.0) return ['#FFAA00', '#CC8800'];
    return ['#FF6644', '#CC4422'];
  };

  const getFeatureEmoji = (featureName: string) => {
    return featureEmojis[featureName] || '⭐';
  };

  const handleViewDetails = () => {
    router.push('/detailed-analysis');
  };

  const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 10) * circumference;
    
    return (
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              filter: `drop-shadow(0 0 8px ${getScoreColor(score)}40)`,
            }}
          />
        </Svg>
        <View style={styles.circularProgressContent}>
          <Text style={[styles.circularProgressScore, { color: getScoreColor(score) }]}>
            {score.toFixed(1)}
          </Text>
          <Text style={styles.circularProgressLabel}>/ 10</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color="#FFFFFF" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Share color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hero Section with Profile Image and Overall Score */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>You're a</Text>
              
              <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
                    style={styles.profileImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.profileImageOverlay}
                  />
                </View>
                
                <View style={styles.overallScoreContainer}>
                  <CircularProgress score={currentResult.overallScore} size={100} />
                  <Text style={styles.overallRating}>{currentResult.overallRating}</Text>
                </View>
              </View>
            </View>

            {/* Features List */}
            <View style={styles.featuresSection}>
              {currentResult.features.map((result, index) => {
                const IconComponent = iconMap[result.icon] || User;
                return (
                  <View key={result.id} style={styles.featureRow}>
                    <View style={styles.featureLeft}>
                      <Text style={styles.featureEmoji}>
                        {getFeatureEmoji(result.name)}
                      </Text>
                      <View style={styles.featureInfo}>
                        <Text style={styles.featureName}>{result.name}</Text>
                        <View style={styles.blurredContent}>
                          <BlurView intensity={20} style={styles.blurView}>
                            <Text style={styles.blurredText}>{result.description}</Text>
                          </BlurView>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.featureRight}>
                      <CircularProgress score={result.score} size={60} />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Blurred Recommendations Section */}
            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              <View style={styles.blurredRecommendations}>
                <BlurView intensity={25} style={styles.recommendationsBlur}>
                  {currentResult.recommendations.slice(0, 3).map((rec, index) => (
                    <View key={rec.id} style={styles.blurredRecommendationCard}>
                      <View style={styles.lockIcon}>
                        <Lock color="rgba(255, 255, 255, 0.6)" size={16} />
                      </View>
                      <Text style={styles.blurredRecommendationTitle}>{rec.title}</Text>
                      <Text style={styles.blurredRecommendationDescription}>
                        {rec.description}
                      </Text>
                    </View>
                  ))}
                </BlurView>
              </View>
            </View>

            {/* View Detailed Results Button */}
            <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
              <LinearGradient
                colors={['#FF69B4', '#FF1493', '#FF69B4']}
                style={styles.detailsGradient}
              >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.detailsButtonText}>View Detailed Results</Text>
                <ArrowDown color="#FFFFFF" size={20} />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  overallScoreContainer: {
    alignItems: 'center',
    gap: 8,
  },
  circularProgress: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularProgressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  circularProgressLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: -4,
  },
  overallRating: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  featureEmoji: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  blurredContent: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  blurView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  blurredText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 14,
  },
  featureRight: {
    marginLeft: 16,
  },
  recommendationsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  blurredRecommendations: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendationsBlur: {
    padding: 20,
  },
  blurredRecommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  lockIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurredRecommendationTitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  blurredRecommendationDescription: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 12,
    flex: 2,
  },
  detailsButton: {
    margin: 24,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  detailsGradient: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});