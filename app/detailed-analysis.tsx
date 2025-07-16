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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useAnalysis } from '@/hooks/useAnalysis';

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

export default function DetailedAnalysisScreen() {
  const { currentResult, getLatestAnalysis, setCurrentResult } = useAnalysis();
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Detailed analysis screen loaded, current result:', currentResult);
    
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
  }, [currentResult, getLatestAnalysis, setCurrentResult]);

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FF88" />
            <Text style={styles.loadingText}>Loading detailed analysis...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!currentResult) {
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

  const selectedFeature = currentResult.features[selectedFeatureIndex];
  const featureBreakdown = currentResult.detailedBreakdown[selectedFeature.name];

  const handlePreviousFeature = () => {
    setSelectedFeatureIndex(prev => 
      prev > 0 ? prev - 1 : currentResult.features.length - 1
    );
  };

  const handleNextFeature = () => {
    setSelectedFeatureIndex(prev => 
      prev < currentResult.features.length - 1 ? prev + 1 : 0
    );
  };

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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.95)', 'rgba(10, 10, 10, 0.95)']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft color="#FFFFFF" size={20} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>
                  {getFeatureEmoji(selectedFeature.name)} {selectedFeature.name} Analysis
                </Text>
                <Text style={styles.featureCounter}>
                  {selectedFeatureIndex + 1} of {currentResult.features.length}
                </Text>
              </View>
              <TouchableOpacity style={styles.favoriteButton}>
                <Heart color="#FF69B4" size={20} fill="#FF69B4" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.stickyNavigation}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.95)', 'rgba(10, 10, 10, 0.95)']}
              style={styles.navigationContainer}
            >
              <View style={styles.navigationButtons}>
                <TouchableOpacity style={styles.navButton} onPress={handlePreviousFeature}>
                  <LinearGradient
                    colors={['rgba(68, 255, 68, 0.1)', 'rgba(0, 255, 136, 0.1)']}
                    style={styles.navButtonContent}
                  >
                    <ChevronLeft color="#00FF88" size={16} />
                    <Text style={[styles.navButtonText, { color: '#00FF88' }]}>Previous</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNextFeature}>
                  <LinearGradient
                    colors={['#00FF88', '#44FF44']}
                    style={styles.navButtonContent}
                  >
                    <Text style={styles.navButtonPrimaryText}>Next</Text>
                    <ChevronRight color="#000" size={16} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.scoreSection}>
              <View style={styles.scoreCard}>
                <View style={styles.scoreHeader}>
                  <View style={styles.scoreLeft}>
                    <Text style={styles.scoreTitle}>
                      {getFeatureEmoji(selectedFeature.name)} {selectedFeature.name} Score
                    </Text>
                    <Text style={styles.scoreDescription}>{selectedFeature.description}</Text>
                  </View>
                  <View style={styles.scoreRight}>
                    <Text style={[styles.featureScore, { color: getScoreColor(selectedFeature.score) }]}>
                      {selectedFeature.score.toFixed(1)}
                    </Text>
                    <Text style={styles.scoreRating}>{selectedFeature.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <LinearGradient
                      colors={getProgressColors(selectedFeature.score)}
                      style={[styles.progressBar, { width: `${selectedFeature.score * 10}%` }]}
                    />
                  </View>
                </View>

                {/* Display all feature data */}
                <View style={styles.featureDetails}>
                  {selectedFeature.percent && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📊 Percentile:</Text>
                      <Text style={[styles.detailValue, { color: getScoreColor(selectedFeature.score) }]}>
                        {selectedFeature.percent}%
                      </Text>
                    </View>
                  )}
                  
                  {selectedFeature.keywords && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🏷️ Keywords:</Text>
                      <Text style={styles.detailValue}>{selectedFeature.keywords}</Text>
                    </View>
                  )}

                  {selectedFeature.types && selectedFeature.types.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🔖 Types:</Text>
                      <View style={styles.typesContainer}>
                        {selectedFeature.types.map((type, index) => (
                          <View key={index} style={styles.typeTag}>
                            <Text style={styles.typeText}>{type}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {selectedFeature.feedbackgood && (
                    <View style={styles.feedbackSection}>
                      <Text style={styles.feedbackTitle}>✅ What Works Well:</Text>
                      <Text style={styles.feedbackText}>{selectedFeature.feedbackgood}</Text>
                    </View>
                  )}

                  {selectedFeature.feedbackbad && (
                    <View style={styles.feedbackSection}>
                      <Text style={styles.feedbackTitle}>⚠️ Areas for Enhancement:</Text>
                      <Text style={styles.feedbackText}>{selectedFeature.feedbackbad}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Display all improvements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Improvement Suggestions</Text>
              <View style={styles.improvementsList}>
                {[
                  selectedFeature.improvement1,
                  selectedFeature.improvement2,
                  selectedFeature.improvement3,
                  selectedFeature.improvement4,
                ].filter(Boolean).map((improvement, index) => {
                  const improvementColors = ['#00FF88', '#44FF44', '#88FF00', '#FFAA00'];
                  const improvementColor = improvementColors[index % improvementColors.length];
                  return (
                    <View key={index} style={[styles.improvementCard, { borderLeftColor: improvementColor }]}>
                      <View style={styles.improvementContent}>
                        <View style={[styles.improvementNumber, { backgroundColor: improvementColor }]}>
                          <Text style={styles.improvementNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.improvementText}>{improvement}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {featureBreakdown && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📈 Detailed Breakdown</Text>
                  <View style={styles.breakdownList}>
                    {featureBreakdown.subcategories.map((item, index) => (
                      <View key={index} style={styles.breakdownItem}>
                        <Text style={styles.breakdownName}>{item.name}</Text>
                        <View style={styles.breakdownRight}>
                          <Text style={[styles.breakdownScore, { color: getScoreColor(item.score) }]}>
                            {item.score.toFixed(1)}
                          </Text>
                          <View style={styles.breakdownProgress}>
                            <View style={styles.breakdownTrack}>
                              <LinearGradient
                                colors={getProgressColors(item.score)}
                                style={[styles.breakdownBar, { width: `${item.score * 10}%` }]}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💄 Styling Recommendations</Text>
                  <View style={styles.tipsList}>
                    {featureBreakdown.tips.map((tip, index) => {
                      const tipColors = ['#00FF88', '#44FF44', '#88FF00', '#FFAA00'];
                      const tipColor = tipColors[index % tipColors.length];
                      return (
                        <View key={index} style={[styles.tipCard, { borderLeftColor: tipColor }]}>
                          <View style={styles.tipContent}>
                            <View style={[styles.tipNumber, { backgroundColor: tipColor }]}>
                              <Text style={styles.tipNumberText}>{index + 1}</Text>
                            </View>
                            <View style={styles.tipText}>
                              <Text style={styles.tipTitle}>{tip.title}</Text>
                              <Text style={styles.tipDescription}>{tip.description}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 All Recommendations</Text>
              <View style={styles.allRecommendations}>
                {currentResult.recommendations.map((rec, index) => {
                  const recColors = ['#00FF88', '#44FF44', '#88FF00', '#FFAA00', '#FF69B4', '#9966FF'];
                  const recColor = recColors[index % recColors.length];
                  return (
                    <View key={rec.id} style={[styles.recommendationCard, { borderLeftColor: recColor }]}>
                      <View style={styles.recommendationHeader}>
                        <Text style={styles.recommendationTitle}>{rec.title}</Text>
                        <Text style={[styles.recommendationCategory, { color: recColor }]}>
                          {rec.category.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.recommendationDescription}>{rec.description}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.navButton} onPress={handlePreviousFeature}>
                <LinearGradient
                  colors={['rgba(68, 255, 68, 0.1)', 'rgba(0, 255, 136, 0.1)']}
                  style={styles.navButtonContent}
                >
                  <ChevronLeft color="#00FF88" size={16} />
                  <Text style={[styles.navButtonText, { color: '#00FF88' }]}>Previous Feature</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNextFeature}>
                <LinearGradient
                  colors={['#00FF88', '#44FF44']}
                  style={styles.navButtonContent}
                >
                  <Text style={styles.navButtonPrimaryText}>Next Feature</Text>
                  <ChevronRight color="#000" size={16} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  header: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  featureCounter: {
    color: '#00FF88',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textShadowColor: 'rgba(0, 255, 136, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.4)',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  scoreSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  scoreDescription: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  scoreRight: {
    alignItems: 'flex-end',
  },
  featureScore: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2.5,
  },
  scoreRating: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressTrack: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  featureDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  detailValue: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  typeTag: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.4)',
  },
  typeText: {
    color: '#00FF88',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 255, 136, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  feedbackSection: {
    marginTop: 8,
  },
  feedbackTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  feedbackText: {
    color: '#E0E0E0',
    fontSize: 13,
    lineHeight: 18,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  improvementsList: {
    gap: 12,
  },
  improvementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 2.5,
  },
  improvementContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  improvementNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1.5,
  },
  improvementNumberText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  improvementText: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
  breakdownList: {
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1.5,
  },
  breakdownName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownScore: {
    fontSize: 14,
    fontWeight: '600',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  breakdownProgress: {
    width: 80,
  },
  breakdownTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  tipsList: {
    gap: 16,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 2.5,
  },
  tipContent: {
    flexDirection: 'row',
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1.5,
  },
  tipNumberText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  tipDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
  allRecommendations: {
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 1.5,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  recommendationCategory: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  recommendationDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    lineHeight: 18,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  stickyNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  navigationContainer: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  navButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    overflow: 'hidden',
    shadowColor: 'rgba(0, 255, 136, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1.5,
  },
  navButtonPrimary: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 255, 136, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  navButtonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  navButtonPrimaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});