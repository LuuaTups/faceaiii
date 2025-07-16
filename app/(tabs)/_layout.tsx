import { Tabs } from 'expo-router';
import { Chrome as Home, History, Lightbulb, User, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.2)',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          textShadowColor: 'rgba(255, 255, 255, 0.1)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 0.5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} style={{
              shadowColor: color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 1,
            }} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} style={{
              shadowColor: color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 1,
            }} />
          ),
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarIcon: ({ color, size }) => (
            <Lightbulb color={color} size={size} style={{
              shadowColor: color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 1,
            }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} style={{
              shadowColor: color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 1,
            }} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} style={{
              shadowColor: color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 1,
            }} />
          ),
        }}
      />
    </Tabs>
  );
}