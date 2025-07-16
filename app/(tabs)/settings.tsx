import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard as Edit3, User, Shield, History, Settings as SettingsIcon, Bell, Camera, CircleHelp as HelpCircle, Mail, Star, LogOut } from 'lucide-react-native';

const settingsData = [
  {
    section: 'Account',
    items: [
      { id: 1, title: 'Edit Profile', icon: User, color: '#FFFFFF', hasArrow: true },
      { id: 2, title: 'Privacy & Security', icon: Shield, color: '#F0F0F0', hasArrow: true },
      { id: 3, title: 'Analysis History', icon: History, color: '#E0E0E0', hasArrow: true, badge: '12' },
    ],
  },
  {
    section: 'Preferences',
    items: [
      { id: 4, title: 'Analysis Detail Level', icon: SettingsIcon, color: '#D0D0D0', hasArrow: true, value: 'Detailed' },
      { id: 5, title: 'Auto-Save Photos', icon: Camera, color: '#C0C0C0', hasToggle: true, enabled: true },
      { id: 6, title: 'Push Notifications', icon: Bell, color: '#B0B0B0', hasToggle: true, enabled: false },
    ],
  },
  {
    section: 'Support',
    items: [
      { id: 7, title: 'Help & FAQ', icon: HelpCircle, color: '#A0A0A0', hasArrow: true },
      { id: 8, title: 'Contact Support', icon: Mail, color: '#909090', hasArrow: true },
      { id: 9, title: 'Rate App', icon: Star, color: '#808080', hasArrow: true },
    ],
  },
];

export default function SettingsScreen() {
  const [toggleStates, setToggleStates] = useState({
    5: true,  // Auto-Save Photos
    6: false, // Push Notifications
  });

  const handleToggle = (id: number) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#111111']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.05)', 'rgba(240, 240, 240, 0.05)']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton}>
              <ArrowLeft color="#FFFFFF" size={20} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.05)', 'rgba(240, 240, 240, 0.05)']}
          style={styles.profileSection}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F0F0F0']}
                  style={styles.avatarGradient}
                >
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
                    style={styles.avatar}
                  />
                </LinearGradient>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Alex Johnson</Text>
                <Text style={styles.userEmail}>alex.johnson@email.com</Text>
                <Text style={styles.premiumBadge}>Premium Member</Text>
              </View>
              <TouchableOpacity style={styles.editProfileButton}>
                <Edit3 color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {settingsData.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
              <View style={styles.sectionItems}>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.settingsItem}
                    onPress={() => item.hasToggle && handleToggle(item.id)}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.itemIcon, { backgroundColor: `rgba(255, 255, 255, 0.1)` }]}>
                        <item.icon color={item.color} size={16} />
                      </View>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.itemRight}>
                      {item.badge && (
                        <Text style={styles.itemBadge}>{item.badge}</Text>
                      )}
                      {item.value && (
                        <Text style={styles.itemValue}>{item.value}</Text>
                      )}
                      {item.hasToggle && (
                        <View style={styles.toggleContainer}>
                          <View style={[
                            styles.toggleTrack,
                            toggleStates[item.id] ? styles.toggleTrackActive : styles.toggleTrackInactive
                          ]}>
                            <View style={[
                              styles.toggleThumb,
                              toggleStates[item.id] ? styles.toggleThumbActive : styles.toggleThumbInactive
                            ]} />
                          </View>
                        </View>
                      )}
                      {item.hasArrow && (
                        <Text style={styles.itemArrow}>›</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.signOutButton}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.05)', 'rgba(240, 240, 240, 0.05)']}
              style={styles.signOutGradient}
            >
              <LogOut color="#FFFFFF" size={20} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  headerSpacer: {
    width: 32,
  },
  profileSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  userEmail: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  premiumBadge: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  editProfileButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionItems: {
    gap: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemBadge: {
    color: '#D0D0D0',
    fontSize: 14,
  },
  itemValue: {
    color: '#D0D0D0',
    fontSize: 14,
  },
  itemArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  toggleContainer: {
    width: 48,
    height: 24,
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
  },
  toggleTrackInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    position: 'absolute',
    top: 2,
  },
  toggleThumbActive: {
    right: 2,
  },
  toggleThumbInactive: {
    left: 2,
    backgroundColor: '#FFFFFF',
  },
  signOutButton: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
});