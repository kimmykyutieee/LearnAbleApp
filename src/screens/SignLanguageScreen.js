import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

const SignLanguageScreen = ({ onBack, speak }) => {
  const [signLanguage, setSignLanguage] = useState({
    currentCategory: 'daily',
    currentWordIndex: 0,
    categories: {
      daily: [
        { word: 'Good Morning', description: 'Hand on forehead, wave forward', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/01-2in.gif', stepByStep: '1. Hand on forehead\n2. Move forward\n3. Smile!', internationalSL: 'Chin to forward movement' },
        { word: 'Hello', description: 'Wave your hand nicely', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/02-2in.gif', stepByStep: '1. Raise hand\n2. Wave back and forth', internationalSL: 'Salute from forehead' },
        { word: 'Thank You', description: 'Touch chin and move forward', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/04-2in.gif', stepByStep: '1. Touch chin\n2. Move hand out', internationalSL: 'Blowing a kiss motion' },
        { word: 'Please', description: 'Rub chest in circle', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/05-2in.gif', stepByStep: '1. Palm on chest\n2. Rub in circle', internationalSL: 'Circle rub on chest' }
      ],
      emotions: [
        { word: 'Happy', description: 'Brush up chest with smile', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/07.gif', stepByStep: '1. Hands on chest\n2. Brush up\n3. Big smile!', internationalSL: 'Upward brushing motion' },
        { word: 'Sad', description: 'Trace tears from eyes', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/09.gif', stepByStep: '1. Fingers at eyes\n2. Move down face', internationalSL: 'Tracing tears' },
        { word: 'Angry', description: 'Claw hands moving up', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/08.gif', stepByStep: '1. Make claws\n2. Push up from stomach', internationalSL: 'Rising anger motion' },
      ],
      sports: [
        { word: 'Go For It', description: 'Pump fists down', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/10.gif', stepByStep: '1. Make fists\n2. Pump down twice', internationalSL: 'Encouragement pump' },
        { word: 'Congratulations', description: 'Lift clasped hands', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/11.gif', stepByStep: '1. Clasp hands\n2. Lift up and open', internationalSL: 'Celebration gesture' },
        { word: 'Clapping', description: 'Flutter hands high', image: 'https://www.tokyoforward2025.metro.tokyo.lg.jp/wp-content/themes/anothemes/manabou_deaflympics/img/14.gif', stepByStep: '1. Hands high\n2. Twist back and forth', internationalSL: 'Visual applause' }
      ]
    }
  });

  const currentWords = signLanguage.categories[signLanguage.currentCategory];
  const currentWord = currentWords[signLanguage.currentWordIndex];

  const handleCategoryChange = (category) => {
    setSignLanguage(prev => ({ ...prev, currentCategory: category, currentWordIndex: 0 }));
    speak(`${category} category selected`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.navBack} onPress={onBack}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
          <Text style={styles.navTitle}>Hand Signs</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 15}}>
          {Object.keys(signLanguage.categories).map(cat => (
            <TouchableOpacity key={cat} onPress={() => handleCategoryChange(cat)} style={[styles.pillButton, signLanguage.currentCategory === cat ? {backgroundColor: THEME.primary} : {backgroundColor: 'white'}]}>
              <Text style={[styles.pillText, signLanguage.currentCategory === cat ? {color: 'white'} : {color: THEME.text}]}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.bigWord}>{currentWord.word}</Text>
          <Image source={{ uri: currentWord.image }} style={styles.signImage} resizeMode="contain" />
          <TouchableOpacity style={styles.speakerButton} onPress={() => speak(`${currentWord.word}. ${currentWord.description}`)}>
            <Ionicons name="volume-high" size={24} color="white" />
            <Text style={{color:'white', fontWeight:'bold', marginLeft: 8}}>Listen</Text>
          </TouchableOpacity>
          <Text style={styles.descText}>{currentWord.description}</Text>
          <View style={styles.navRow}>
            <TouchableOpacity disabled={signLanguage.currentWordIndex === 0} onPress={() => { if (signLanguage.currentWordIndex > 0) setSignLanguage(prev => ({...prev, currentWordIndex: prev.currentWordIndex - 1})); }} style={[styles.arrowBtn, signLanguage.currentWordIndex === 0 && {backgroundColor: '#ccc'}]}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: THEME.text}}>{signLanguage.currentWordIndex + 1} / {currentWords.length}</Text>
            <TouchableOpacity disabled={signLanguage.currentWordIndex === currentWords.length - 1} onPress={() => { if (signLanguage.currentWordIndex < currentWords.length - 1) setSignLanguage(prev => ({...prev, currentWordIndex: prev.currentWordIndex + 1})); }} style={[styles.arrowBtn, signLanguage.currentWordIndex === currentWords.length - 1 && {backgroundColor: '#ccc'}]}>
              <Ionicons name="arrow-forward" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContainer: { flexGrow: 1, padding: 20, paddingBottom: 50 },
  navHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.primary, padding: 15, borderRadius: 15, marginBottom: 20 },
  navBack: { marginRight: 15 },
  navTitle: { color: 'white', fontSize: 24, fontWeight: '900' },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 3, borderColor: '#B3E5FC', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  pillButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: THEME.primary },
  pillText: { fontWeight: 'bold' },
  bigWord: { fontSize: 36, fontWeight: '900', color: THEME.primary, textAlign: 'center', marginBottom: 10 },
  signImage: { width: '100%', height: 220, borderRadius: 15, marginBottom: 15, backgroundColor: '#f0f0f0' },
  speakerButton: { flexDirection: 'row', backgroundColor: THEME.accent, padding: 12, borderRadius: 25, alignSelf: 'center', marginBottom: 15, alignItems: 'center' },
  descText: { fontSize: 18, textAlign: 'center', color: THEME.text, marginBottom: 20, fontWeight: '500' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  arrowBtn: { backgroundColor: THEME.primary, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
});

export default SignLanguageScreen;