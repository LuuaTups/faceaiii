import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, Image as ImageIcon, Eye, CircleCheck as CheckCircle, User, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useAuth } from '@/hooks/useAuth';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { analyzePhoto, isAnalyzing } = useAnalysis();
  const { user, isAuthenticated } = useAuth();
  const cameraRef = useRef<any>(null);

  // Animation values
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const sparkleRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for upload icon
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Sparkle rotation animation
    const sparkleLoop = Animated.loop(
      Animated.timing(sparkleRotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    sparkleLoop.start();

    return () => {
      pulseLoop.stop();
      sparkleLoop.stop();
    };
  }, []);

  const sparkleRotationInterpolate = sparkleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const openCamera = async () => {
    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }
    }

    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }
    }

    setShowCamera(true);
  };

  const pickImage = () => {
    Alert.alert('Coming Soon', 'Gallery picker will be available in the next update!');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setShowCamera(false);
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    
    try {
      console.log('Starting analysis for captured image:', capturedImage);
      
      // Analyze the image and get the result
      const result = await analyzePhoto(capturedImage);
      console.log('Analysis completed, result:', result);
      
      // Clear captured image and navigate to results
      setCapturedImage(null);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        console.log('Navigating to results...');
        router.push('/results');
      }, 100);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image. Please try again.';
      Alert.alert('Analysis Error', errorMessage);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const handleCancelPhoto = () => {
    setCapturedImage(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Image preview screen
  if (capturedImage) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#111111']}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          <View style={styles.previewHeader}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPhoto}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Photo Preview</Text>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          </View>

          <View style={styles.previewActions}>
            <Text style={styles.previewDescription}>
              Ready to analyze your photo? Our AI will provide detailed insights about your facial features.
            </Text>
            
            <TouchableOpacity 
              style={styles.analyzeButton} 
              onPress={handleAnalyze}
              disabled={isAnalyzing}
            >
              <LinearGradient
                colors={['#FF69B4', '#FF1493']}
                style={styles.analyzeGradient}
              >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.analyzeButtonText}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Photo'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCamera(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.cameraControlsContainer}>
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                  <Text style={styles.controlButtonText}>Flip</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <View style={styles.placeholder} />
              </View>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#111111']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#FF69B4', '#FF1493']}
              style={styles.logo}
            >
              <Eye color="#FFFFFF" size={20} />
            </LinearGradient>
            <Text style={styles.logoText}>FaceAnalyzer AI</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.authenticatedIndicator}>
              <User color="#00FF88" size={20} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeSection}>
            <Animated.View style={{ transform: [{ rotate: sparkleRotationInterpolate }] }}>
              <Sparkles color="#FF69B4" size={32} style={styles.titleSparkle} />
            </Animated.View>
            <Text style={styles.welcomeTitle}>
              {isAuthenticated ? `Welcome back, ${user?.email?.split('@')[0]}!` : 'Discover Your Beauty'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Upload your photo and get AI-powered analysis of your facial features with personalized styling tips
            </Text>
          </View>

          <View style={styles.uploadCard}>
            <Animated.View style={[styles.uploadIconContainer, { transform: [{ scale: pulseAnimation }] }]}>
              <LinearGradient
                colors={['#FF69B4', '#FF1493', '#FF69B4']}
                style={styles.uploadIcon}
              >
                <ImageIcon color="#FFFFFF" size={40} />
              </LinearGradient>
            </Animated.View>
            
            <Text style={styles.uploadTitle}>Upload Your Photo</Text>
            <Text style={styles.uploadSubtitle}>
              Take a clear selfie or choose from your gallery for real AI analysis
            </Text>

            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
                <LinearGradient
                  colors={['#FF69B4', '#FF1493']}
                  style={styles.buttonGradient}
                >
                  <Camera color="#FFFFFF" size={20} />
                  <Text style={styles.buttonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <ImageIcon color="#FF69B4" size={20} />
                <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Real AI Analysis Features:</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <CheckCircle color="#FFFFFF" size={12} />
                </View>
                <Text style={styles.featureText}>OpenAI Vision API integration</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <CheckCircle color="#FFFFFF" size={12} />
                </View>
                <Text style={styles.featureText}>Detailed facial feature analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <CheckCircle color="#FFFFFF" size={12} />
                </View>
                <Text style={styles.featureText}>Personalized beauty recommendations</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <CheckCircle color="#FFFFFF" size={12} />
                </View>
                <Text style={styles.featureText}>Expert styling advice</Text>
              </View>
            </View>
          </View>

          <View style={styles.additionalSection}>
            <Text style={styles.sectionTitle}>Why Choose FaceAnalyzer?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <LinearGradient
                  colors={['#FF69B4', '#FF1493']}
                  style={styles.benefitIcon}
                >
                  <Sparkles color="#FFFFFF" size={16} />
                </LinearGradient>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Advanced AI Technology</Text>
                  <Text style={styles.benefitDescription}>
                    Powered by OpenAI's latest vision models for accurate analysis
                  </Text>
                </View>
              </View>
              
              <View style={styles.benefitItem}>
                <LinearGradient
                  colors={['#FF69B4', '#FF1493']}
                  style={styles.benefitIcon}
                >
                  <Eye color="#FFFFFF" size={16} />
                </LinearGradient>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Personalized Insights</Text>
                  <Text style={styles.benefitDescription}>
                    Get customized beauty tips tailored to your unique features
                  </Text>
                </View>
              </View>
              
              <View style={styles.benefitItem}>
                <LinearGradient
                  colors={['#FF69B4', '#FF1493']}
                  style={styles.benefitIcon}
                >
                  <User color="#FFFFFF" size={16} />
                </LinearGradient>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Privacy First</Text>
                  <Text style={styles.benefitDescription}>
                    Your photos are processed securely and never stored permanently
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Discover Your Beauty?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of users who have enhanced their natural beauty with AI-powered insights
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={openCamera}>
              <LinearGradient
                colors={['#FF69B4', '#FF1493']}
                style={styles.ctaGradient}
              >
                <Sparkles color="#FFFFFF" size={20} />
                <Text style={styles.ctaButtonText}>Start Your Analysis</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  authenticatedIndicator: {
    shadowColor: 'rgba(0, 255, 136, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  titleSparkle: {
    marginBottom: 16,
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2.5,
  },
  welcomeTitle: {
    color: '#FF69B4',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  welcomeSubtitle: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  uploadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  uploadIconContainer: {
    marginBottom: 20,
  },
  uploadIcon: {
    width: 96,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  uploadTitle: {
    color: '#FF69B4',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1.5,
  },
  uploadSubtitle: {
    color: '#D0D0D0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  uploadButtons: {
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 105, 180, 0.6)',
    gap: 12,
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  featuresTitle: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1.2,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  featureText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.3,
  },
  additionalSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FF69B4',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1.5,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 1.5,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.8,
  },
  benefitDescription: {
    color: '#D0D0D0',
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.3,
  },
  ctaSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaTitle: {
    color: '#FF69B4',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 105, 180, 0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  ctaSubtitle: {
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    gap: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  retakeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  previewImage: {
    width: '100%',
    height: '70%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  previewActions: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  previewDescription: {
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: '300',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  analyzeButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(255, 105, 180, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});