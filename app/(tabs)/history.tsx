import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MoveVertical as MoreVertical, ChevronRight, Trash2, Sparkles } from 'lucide-react-native';
import { useAnalysis } from '@/hooks/useAnalysis';
import { router } from 'expo-router';

const getScoreColor = (score: number) => {
  if (score >= 8.5) return '#FFFFFF';
  if (score >= 8.0) return '#F0F0F0';
  if (score >= 7.5) return '#E0E0E0';
  return '#D0D0D0';
};

const getFeatureColor = (index: number) => {
  const colors = [
    { bg: 'rgba(255, 255, 255, 0.1)', text: '#FFFFFF' },
    { bg: 'rgba(240, 240, 240, 0.1)', text: '#F0F0F0' },
    { bg: 'rgba(224, 224, 224, 0.1)', text: '#E0E0E0' },
    { bg: 'rgba(208, 208, 208, 0.1)', text: '#D0D0D0' },
    { bg: 'rgba(192, 192, 192, 0.1)', text: '#C0C0C0' },
    { bg: 'rgba(176, 176, 176, 0.1)', text: '#B0B0B0' },
  ];
  return colors[index % colors.length];
};

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

export default function HistoryScreen() {
  const { history, loadHistory, clearHistory } = useAnalysis();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all analysis history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearHistory
        }
      ]
    );
  };

  const handleItemPress = (item: any) => {
    // Set the current result and navigate to results
    router.push('/results');
  };

  const calculateStats = () => {
    if (history.length === 0) return { total: 0, average: 0, thisWeek: 0 };
    
    const total = history.length;
    const average = history.reduce((sum, item) => sum + item.result.overallScore, 0) / total;
    
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const thisWeek = history.filter(item => item.timestamp > weekAgo).length;
    
    return { total, average, thisWeek };
  };

  const stats = calculateStats();

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#111111']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(240, 240, 240, 0.1)']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton}>
              <ArrowLeft color="#FFFFFF" size={20} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Analysis History</Text>
            <TouchableOpacity style={styles.menuButton}>
              <MoreVertical color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(240, 240, 240, 0.1)']}
          style={styles.statsSection}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Sparkles color="#FFFFFF" size={20} style={styles.statIcon} />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.average.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.thisWeek}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentHeader}>
            <Text style={styles.sectionTitle}>Recent Analyses</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <View style={styles.clearButton}>
                  <Trash2 color="#FFFFFF" size={16} />
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Sparkles color="#FFFFFF" size={48} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Analysis History</Text>
              <Text style={styles.emptyDescription}>
                Take your first photo to start building your beauty analysis history
              </Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => router.push('/(tabs)')}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F0F0F0']}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Start Analysis</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.historyItem}
                  onPress={() => handleItemPress(item)}
                >
                  <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
                  <View style={styles.historyContent}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>Analysis #{item.id.slice(-4)}</Text>
                      <Text style={[styles.historyScore, { color: getScoreColor(item.result.overallScore) }]}>
                        {item.result.overallScore.toFixed(1)}
                      </Text>
                    </View>
                    <Text style={styles.historyTime}>{formatTimeAgo(item.timestamp)}</Text>
                    <View style={styles.featureTags}>
                      {item.result.features.slice(0, 2).map((feature, index) => {
                        const colors = getFeatureColor(index);
                        return (
                          <View
                            key={feature.id}
                            style={[styles.featureTag, { backgroundColor: colors.bg }]}
                          >
                            <Text style={[styles.featureTagText, { color: colors.text }]}>
                              {feature.name}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <ChevronRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 24,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1.5,
  },
  statIcon: {
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyIcon: {
    marginBottom: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  emptyDescription: {
    color: '#D0D0D0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  startButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  startButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  historyList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1.5,
  },
  historyImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  historyScore: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1.5,
  },
  historyTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginBottom: 8,
  },
  featureTags: {
    flexDirection: 'row',
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
  featureTagText: {
    fontSize: 12,
    fontWeight: '500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
});