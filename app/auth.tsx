import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async () => {
    // Clear any previous errors
    setError(null);
    setSuccess(null);
    setInfo(null);
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Confirm password validation for signup
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Additional password strength for signup
    if (isSignUp) {
      if (!/(?=.*[a-z])/.test(password)) {
        setError('Password must contain at least one lowercase letter');
        return;
      }
      if (!/(?=.*\d)/.test(password)) {
        setError('Password must contain at least one number');
        return;
      }
    }

    // Additional confirm password validation
    if (isSignUp && !confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        
        // Check if email confirmation is required
        if (result.user && !result.session) {
          setSuccess('Account created successfully!');
          setInfo('Please check your email and click the confirmation link to complete your registration. You can then sign in with your credentials.');
          return;
        }
      } else {
        await signIn(email, password);
      }
      // Success - auth state change will handle navigation
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null); // Clear errors when switching modes
    setSuccess(null);
    setInfo(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
          
          <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.95)', 'rgba(10, 10, 10, 0.95)']}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <ArrowLeft color="#FFFFFF" size={20} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
                <View style={styles.headerSpacer} />
              </View>
            </LinearGradient>

            <View style={styles.content}>
              <View style={styles.welcomeSection}>
                <Sparkles color="#FF69B4" size={32} style={styles.titleSparkle} />
                <Text style={styles.welcomeTitle}>
                  {isSignUp ? 'Join FaceAnalyzer' : 'Welcome Back'}
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  {isSignUp 
                    ? 'Create your account to save and track your beauty analysis history'
                    : 'Sign in to access your saved analysis history and personalized recommendations'
                  }
                </Text>
              </View>

              <View style={styles.formCard}>
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                  </View>
                )}

                {success && (
                  <View style={styles.successContainer}>
                    <Text style={styles.successText}>✅ {success}</Text>
                  </View>
                )}

                {info && (
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>📧 {info}</Text>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>📧 Email Address</Text>
                  <View style={styles.inputContainer}>
                    <Mail color="#FFFFFF" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>🔒 Password</Text>
                  <View style={styles.inputContainer}>
                    <Lock color="#FFFFFF" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff color="rgba(255, 255, 255, 0.6)" size={20} />
                      ) : (
                        <Eye color="rgba(255, 255, 255, 0.6)" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {isSignUp && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>🔒 Confirm Password</Text>
                    <View style={styles.inputContainer}>
                      <Lock color="#FFFFFF" size={20} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Confirm your password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff color="rgba(255, 255, 255, 0.6)" size={20} />
                        ) : (
                          <Eye color="rgba(255, 255, 255, 0.6)" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#FF69B4', '#FF1493']}
                    style={styles.submitGradient}
                  >
                    <Sparkles color="#FFFFFF" size={20} />
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.switchMode}>
                  <Text style={styles.switchText}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </Text>
                  <TouchableOpacity onPress={toggleMode}>
                    <Text style={styles.switchLink}>
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.skipSection}>
                <Text style={styles.skipText}>
                  Want to try without an account?
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.skipLink}>Continue as Guest</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleSparkle: {
    marginBottom: 16,
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2.5,
  },
  welcomeTitle: {
    color: '#FF69B4',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  welcomeSubtitle: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  eyeButton: {
    padding: 4,
  },
  submitButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchMode: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  switchText: {
    color: '#E0E0E0',
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.5,
  },
  switchLink: {
    color: '#FF69B4',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  skipSection: {
    alignItems: 'center',
    gap: 8,
  },
  skipText: {
    color: '#D0D0D0',
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.3,
  },
  skipLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 100, 0.3)',
  },
  errorText: {
    color: '#FF6464',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  successText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  infoText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});