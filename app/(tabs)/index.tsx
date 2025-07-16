import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, Image as ImageIcon, Eye, User, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { useAuth } from '@/lib/hooks/useAuth';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { analyzePhoto, isAnalyzing } = useAnalysis();
  const { user, isAuthenticated } = useAuth();
  const cameraRef = useRef<any>(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }
    }
    setShowCamera(true);
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
      await analyzePhoto(capturedImage);
      setCapturedImage(null);
      router.push('/results');
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image. Please try again.';
      Alert.alert('Analysis Error', errorMessage);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Image preview screen
  if (capturedImage) {
    return (
      <LinearGradient colors={['#000000', '#0a0a0a', '#111111']} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={() => setCapturedImage(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Photo Preview</Text>
            <TouchableOpacity onPress={() => setShowCamera(true)}>
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
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
              <LinearGradient colors={['#FF69B4', '#FF1493']} style={styles.analyzeGradient}>
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

  // Camera screen
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCamera(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <Text style={styles.controlText}>Flip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
              
              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Main home screen
  return (
    <LinearGradient colors={['#000000', '#0a0a0a', '#111111']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#FF69B4', '#FF1493']} style={styles.logo}>
              <Eye color="#FFFFFF" size={20} />
            </LinearGradient>
            <Text style={styles.logoText}>FaceAnalyzer AI</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <User color={isAuthenticated ? "#00FF88" : "#FFFFFF"} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Sparkles color="#FF69B4" size={32} style={styles.titleIcon} />
            <Text style={styles.welcomeTitle}>
              {isAuthenticated ? `Welcome back!` : 'Discover Your Beauty'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Upload your photo and get AI-powered analysis of your facial features with personalized styling tips
            </Text>
          </View>

          <View style={styles.uploadCard}>
            <View style={styles.uploadIconContainer}>
              <LinearGradient colors={['#FF69B4', '#FF1493']} style={styles.uploadIcon}>
                <ImageIcon color="#FFFFFF" size={40} />
              </LinearGradient>
            </View>
            
            <Text style={styles.uploadTitle}>Upload Your Photo</Text>
            <Text style={styles.uploadSubtitle}>
              Take a clear selfie for real AI analysis
            </Text>

            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
                <LinearGradient colors={['#FF69B4', '#FF1493']} style={styles.buttonGradient}>
                  <Camera color="#FFFFFF" size={20} />
                  <Text style={styles.buttonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>AI Analysis Features:</Text>
            <View style={styles.featuresList}>
              {[
                'OpenAI Vision API integration',
                'Detailed facial feature analysis', 
                'Personalized beauty recommendations',
                'Expert styling advice'
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
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
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  titleIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    color: '#FF69B4',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
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
  },
  uploadTitle: {
    color: '#FF69B4',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  uploadSubtitle: {
    color: '#D0D0D0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  uploadButtons: {
    width: '100%',
  },
  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
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
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
  },
  featuresTitle: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
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
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureText: {
    color: '#E0E0E0',
    fontSize: 14,
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
    justifyContent: 'space-between',
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
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlText: {
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
  captureInner: {
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
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageContainer: {
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
  },
  analyzeButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
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