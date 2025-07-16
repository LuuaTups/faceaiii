import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Sparkles, Eye, Smile, Palette } from 'lucide-react-native';

const tipCategories = [
  {
    id: 1,
    title: 'Skincare',
    subtitle: 'Daily routines',
    icon: Heart,
    color: '#FFFFFF',
    bgColor: 'rgba(255, 255, 255, 0.1)',
  },
  {
    id: 2,
    title: 'Eye Care',
    subtitle: 'Enhance your eyes',
    icon: Eye,
    color: '#F0F0F0',
    bgColor: 'rgba(240, 240, 240, 0.1)',
  },
  {
    id: 3,
    title: 'Face Shape',
    subtitle: 'Styling tips',
    icon: Smile,
    color: '#E0E0E0',
    bgColor: 'rgba(224, 224, 224, 0.1)',
  },
  {
    id: 4,
    title: 'Makeup',
    subtitle: 'Application tips',
    icon: Palette,
    color: '#D0D0D0',
    bgColor: 'rgba(208, 208, 208, 0.1)',
  },
];

const quickTips = [
  {
    id: 1,
    title: 'Hydration is Key',
    description: 'Drink 8 glasses of water daily for naturally glowing skin.',
    color: '#FFFFFF',
  },
  {
    id: 2,
    title: 'Sleep Well',
    description: 'Get 7-8 hours of quality sleep for skin repair and regeneration.',
    color: '#F0F0F0',
  },
  {
    id: 3,
    title: 'Sun Protection',
    description: 'Always use SPF 30+ sunscreen to prevent premature aging.',
    color: '#E0E0E0',
  },
];

export default function TipsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(240, 240, 240, 0.1)']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton}>
              <ArrowLeft color="#FFFFFF" size={20} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Today's Tips</Text>
            <TouchableOpacity style={styles.heartButton}>
              <Heart color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(240, 240, 240, 0.1)']}
        style={styles.quoteSection}
      >
        <View style={styles.quoteCard}>
          <Sparkles color="#FFFFFF" size={32} style={styles.quoteIcon} />
          <Text style={styles.quoteTitle}>Daily Beauty Tip</Text>
          <Text style={styles.quoteText}>
            "Beauty begins the moment you decide to be yourself. Enhance your natural features with confidence."
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured for You</Text>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.05)', 'rgba(240, 240, 240, 0.05)']}
            style={styles.featuredCard}
          >
            <View style={styles.featuredContent}>
              <View style={styles.featuredIcon}>
                <Sparkles color="#FFFFFF" size={24} />
              </View>
              <View style={styles.featuredText}>
                <Text style={styles.featuredTitle}>Enhance Your Jawline</Text>
                <Text style={styles.featuredDescription}>
                  Based on your analysis, here are personalized tips to maintain your strong jawline definition.
                </Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {tipCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.bgColor }]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                  <category.icon color={category.color} size={16} />
                </View>
                <Text style={[styles.categoryTitle, { color: category.color }]}>{category.title}</Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.quickTipsList}>
            {quickTips.map((tip, index) => (
              <View key={tip.id} style={styles.quickTipItem}>
                <View style={[styles.quickTipNumber, { backgroundColor: tip.color }]}>
                  <Text style={styles.quickTipNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.quickTipContent}>
                  <Text style={styles.quickTipTitle}>{tip.title}</Text>
                  <Text style={styles.quickTipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  quoteSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  quoteIcon: {
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1.5,
  },
  quoteTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  quoteText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  featuredCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  featuredContent: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  featuredText: {
    flex: 1,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  featuredDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
  readMoreButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
  },
  readMoreText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1.5,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  categorySubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  quickTipsList: {
    gap: 12,
  },
  quickTipItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 1.5,
  },
  quickTipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  quickTipNumberText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickTipContent: {
    flex: 1,
  },
  quickTipTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  quickTipDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
});