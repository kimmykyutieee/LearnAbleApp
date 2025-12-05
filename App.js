import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// IMPORT THE SHARED SCREENS AND THEME
import { THEME } from './src/constants/theme';
import RoutineScreen from './src/screens/RoutineScreen';
import QuizScreen from './src/screens/QuizScreen';
import SignLanguageScreen from './src/screens/SignLanguageScreen';

const { width, height } = Dimensions.get('window');

const LearnAbleApp = () => {
  const [currentView, setCurrentView] = useState('splash');
  const [user, setUser] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const soundRef = useRef(null);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    showPassword: false
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [logoScale] = useState(new Animated.Value(1));

  // --- AUDIO CONFIG ---
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
      } catch (e) {
        console.log("Audio setup error:", e);
      }
    };
    initAudio();
  }, []);

  const playBackgroundMusic = async () => {
    if (soundRef.current) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3' },
        { shouldPlay: true, isLooping: true, volume: 0.2 }
      );
      soundRef.current = sound;
      setIsMusicPlaying(true);
    } catch (error) {
      console.log('Music error:', error);
    }
  };

  const toggleMusic = async () => {
    if (soundRef.current) {
      if (isMusicPlaying) await soundRef.current.pauseAsync();
      else await soundRef.current.playAsync();
      setIsMusicPlaying(!isMusicPlaying);
    } else {
      playBackgroundMusic();
    }
  };

  const speak = async (text, options = {}) => {
    try {
      if (soundRef.current && isMusicPlaying) await soundRef.current.setVolumeAsync(0.05);
      await Speech.stop();
      
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.3,
        rate: 1.0,
        onDone: async () => { if (soundRef.current && isMusicPlaying) await soundRef.current.setVolumeAsync(0.2); },
        onStopped: async () => { if (soundRef.current && isMusicPlaying) await soundRef.current.setVolumeAsync(0.2); },
        onError: async () => { if (soundRef.current && isMusicPlaying) await soundRef.current.setVolumeAsync(0.2); },
        ...options
      });
    } catch (error) {
      if (soundRef.current && isMusicPlaying) await soundRef.current.setVolumeAsync(0.2);
    }
  };

  useEffect(() => {
    if (currentView === 'splash') {
      Animated.sequence([
        Animated.timing(logoScale, { toValue: 1.2, duration: 600, easing: Easing.elastic(1), useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1, duration: 400, easing: Easing.bounce, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setCurrentView('login'), 3000);
    }
    
    if (currentView === 'login') {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1000, easing: Easing.elastic(1), useNativeDriver: true }),
      ]).start();
    }
  }, [currentView]);

  const handleLogin = () => {
    if (!loginData.username || !loginData.password) {
      speak('Please enter your name and password');
      Alert.alert('Whoops!', 'We need your name and password to start!');
      return;
    }
    playBackgroundMusic();
    
    const username = loginData.username.toLowerCase();
    if ((username === 'child' || username === 'kid' || username === 'student') && loginData.password === '1234') {
      setUser({ name: 'Student', role: 'child' });
      speak(`Hi there, ${loginData.username}! Let's play and learn!`);
      setCurrentView('home');
    } else if ((username === 'parent' || username === 'teacher') && loginData.password === '1234') {
      setUser({ name: loginData.username, role: 'parent' });
      speak(`Welcome back, ${loginData.username}.`);
      setCurrentView('home');
    } else {
      speak('Uh oh! That didn\'t work.');
      Alert.alert('Try Again!', 'Hint: username "child" and password "1234"', [{ text: 'OK' }]);
    }
  };

  const renderSplashScreen = () => (
    <View style={styles.splashContainer}>
      <StatusBar hidden />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <View style={styles.splashLogo}><Ionicons name="rocket" size={80} color="white" /></View>
        <Text style={styles.splashTitle}>LearnAble</Text>
        <Text style={styles.splashSubtitle}>Learning is Fun!</Text>
      </Animated.View>
    </View>
  );

  const renderLoginScreen = () => (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F7FA" />
      <ScrollView contentContainerStyle={styles.loginScrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.loginBackground}>{[...Array(15)].map((_, i) => (<View key={i} style={[styles.floatingShape, { top: Math.random() * height, left: Math.random() * width, width: Math.random() * 80 + 30, height: Math.random() * 80 + 30, backgroundColor: i % 3 === 0 ? THEME.secondary : i % 3 === 1 ? THEME.accent : THEME.success, opacity: 0.2, borderRadius: 50 }]} />))}</View>

        <Animated.View style={[styles.loginForm, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
          <View style={styles.loginLogoContainer}>
            <View style={styles.loginLogo}><Ionicons name="happy" size={70} color="white" /></View>
            <Text style={styles.loginMainTitle}>LearnAble</Text>
            <Text style={styles.loginSubtitle}>Let's Play!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.inputLabel}>Your Name:</Text>
            <View style={styles.textInputWrapper}>
              <Ionicons name="person" size={24} color={THEME.primary} style={styles.inputIcon} />
              <TextInput style={styles.loginTextInput} placeholder="Type your name" placeholderTextColor="#999" value={loginData.username} onChangeText={(text) => setLoginData(prev => ({ ...prev, username: text }))} autoCapitalize="none" />
            </View>

            <Text style={styles.inputLabel}>Secret Password:</Text>
            <View style={styles.textInputWrapper}>
              <Ionicons name="key" size={24} color={THEME.accent} style={styles.inputIcon} />
              <TextInput style={[styles.loginTextInput, { flex: 1 }]} placeholder="Type password" placeholderTextColor="#999" value={loginData.password} onChangeText={(text) => setLoginData(prev => ({ ...prev, password: text }))} secureTextEntry={!loginData.showPassword} />
              <TouchableOpacity onPress={() => setLoginData(prev => ({ ...prev, showPassword: !prev.showPassword }))}><Ionicons name={loginData.showPassword ? "eye-off" : "eye"} size={24} color={THEME.primary} /></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}><Text style={styles.loginButtonText}>START!</Text><Ionicons name="play-circle" size={28} color="white" /></TouchableOpacity>
          </View>

          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>For Testing:</Text>
            <View style={{flexDirection: 'row', gap: 10, justifyContent: 'center'}}>
              <TouchableOpacity style={styles.demoPill} onPress={() => setLoginData({username:'child', password:'1234', showPassword:false})}><Text style={styles.demoPillText}>Child</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.demoPill, {backgroundColor: THEME.secondary}]} onPress={() => setLoginData({username:'parent', password:'1234', showPassword:false})}><Text style={styles.demoPillText}>Parent</Text></TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderHomeView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F7FA" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerBar}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={styles.avatarCircle}><Ionicons name="person" size={24} color="white" /></View>
            <View style={{marginLeft: 10}}><Text style={styles.headerTitle}>Hi, {user?.name}!</Text><Text style={styles.headerSubtitle}>Ready to learn?</Text></View>
          </View>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity style={styles.logoutIcon} onPress={toggleMusic}><Ionicons name={isMusicPlaying ? "musical-notes" : "musical-notes-outline"} size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity style={styles.logoutIcon} onPress={() => { setUser(null); setLoginData({ username: '', password: '', showPassword: false }); speak('See you later alligator!'); setCurrentView('login'); }}><Ionicons name="log-out" size={24} color="white" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroSection}>
          <TouchableOpacity style={styles.mascotBig} onPress={() => speak(`Hi ${user?.name}! I am your friend. Click a colorful button below to start!`)}><Ionicons name="happy-outline" size={80} color="white" /></TouchableOpacity>
          <Text style={styles.mascotSpeech}>Tap me to say Hello!</Text>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity style={[styles.menuCard, { borderColor: THEME.primary }]} onPress={() => { speak('Quiz Time!'); setCurrentView('quiz'); }} activeOpacity={0.8}><View style={[styles.menuIcon, { backgroundColor: THEME.primary }]}><Ionicons name="bulb" size={40} color="white" /></View><Text style={styles.menuTitle}>Fun Quiz</Text><Text style={styles.menuDesc}>Test your brain!</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.menuCard, { borderColor: THEME.accent }]} onPress={() => { speak('Hand Signs!'); setCurrentView('signLanguage'); }} activeOpacity={0.8}><View style={[styles.menuIcon, { backgroundColor: THEME.accent }]}><Ionicons name="hand-left" size={40} color="white" /></View><Text style={styles.menuTitle}>Hand Signs</Text><Text style={styles.menuDesc}>Learn to sign!</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.menuCard, { borderColor: THEME.success }]} onPress={() => { speak('My Schedule!'); setCurrentView('routine'); }} activeOpacity={0.8}><View style={[styles.menuIcon, { backgroundColor: THEME.success }]}><Ionicons name="calendar" size={40} color="white" /></View><Text style={styles.menuTitle}>My Schedule</Text><Text style={styles.menuDesc}>Plan your day!</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderView = () => {
    switch (currentView) {
      case 'splash': return renderSplashScreen();
      case 'login': return renderLoginScreen();
      // MEMBER 2 COMPONENTS
      case 'quiz': return <QuizScreen onBack={() => setCurrentView('home')} speak={speak} />;
      case 'signLanguage': return <SignLanguageScreen onBack={() => setCurrentView('home')} speak={speak} />;
      // MEMBER 3 COMPONENT
      case 'routine': return <RoutineScreen onBack={() => setCurrentView('home')} speak={speak} />;
      default: return renderHomeView();
    }
  };

  return renderView();
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContainer: { flexGrow: 1, padding: 20, paddingBottom: 50 },
  loginContainer: { flex: 1, backgroundColor: '#E0F7FA' },
  loginScrollContainer: { flexGrow: 1 },
  loginBackground: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  floatingShape: { position: 'absolute' },
  loginForm: { padding: 20, paddingTop: 60 },
  loginLogoContainer: { alignItems: 'center', marginBottom: 30 },
  loginLogo: { width: 120, height: 120, borderRadius: 60, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: 'white', marginBottom: 10 },
  loginMainTitle: { fontSize: 40, fontWeight: '900', color: THEME.primary, letterSpacing: 1 },
  loginSubtitle: { fontSize: 24, color: THEME.text, fontWeight: 'bold' },
  textInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', borderRadius: 25, borderWidth: 2, borderColor: '#B0BEC5', paddingHorizontal: 15, marginBottom: 15 },
  loginTextInput: { flex: 1, paddingVertical: 15, fontSize: 18, color: THEME.text, fontWeight: '600' },
  inputIcon: { marginRight: 10 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', color: THEME.text, marginBottom: 5, marginLeft: 10 },
  loginButton: { backgroundColor: THEME.success, borderRadius: 30, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, borderBottomWidth: 6, borderBottomColor: '#5CB800' },
  loginButtonText: { color: 'white', fontSize: 22, fontWeight: '900' },
  guestButton: { alignItems: 'center', marginTop: 20 },
  guestButtonText: { color: THEME.text, fontSize: 16, textDecorationLine: 'underline' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 3, borderColor: '#B3E5FC', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.primary, padding: 15, borderRadius: 20, marginBottom: 20, borderBottomWidth: 5, borderBottomColor: '#2980B9' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '900' },
  headerSubtitle: { color: 'white', fontSize: 14 },
  logoutIcon: { padding: 5 },
  heroSection: { alignItems: 'center', marginBottom: 30 },
  mascotBig: { width: 140, height: 140, borderRadius: 70, backgroundColor: THEME.secondary, justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: 'white', shadowColor: 'black', shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 },
  mascotSpeech: { marginTop: 10, backgroundColor: 'white', padding: 10, borderRadius: 15, borderWidth: 2, borderColor: THEME.text, fontWeight: 'bold' },
  menuGrid: { gap: 15 },
  menuCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 20, borderWidth: 3, elevation: 3, gap: 15 },
  menuIcon: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontSize: 22, fontWeight: '900', color: THEME.text },
  menuDesc: { fontSize: 14, color: '#7f8c8d' },
  accessBox: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 15, marginTop: 30, alignItems: 'center', gap: 10 },
  accessText: { color: THEME.text, fontWeight: 'bold' },
  splashContainer: { flex: 1, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  splashLogo: { width: 140, height: 140, borderRadius: 70, backgroundColor: THEME.secondary, justifyContent: 'center', alignItems: 'center', borderWidth: 6, borderColor: 'white', marginBottom: 20 },
  splashTitle: { fontSize: 50, fontWeight: '900', color: 'white', letterSpacing: 2 },
  splashSubtitle: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  splashFooter: { position: 'absolute', bottom: 50, alignItems: 'center' },
  splashLoadingText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  loadingDots: { flexDirection: 'row', gap: 10 },
  dot: { width: 15, height: 15, borderRadius: 8 },
  dot1: { opacity: 0.6 }, dot2: { opacity: 0.8 }, dot3: { opacity: 1 },
  demoContainer: { marginTop: 20, alignItems: 'center' },
  demoTitle: { fontSize: 14, color: '#777', fontWeight: 'bold', marginBottom: 5 },
  demoPill: { backgroundColor: THEME.primary, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  demoPillText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});

export default LearnAbleApp;