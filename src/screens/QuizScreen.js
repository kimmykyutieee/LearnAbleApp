import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

const QuizScreen = ({ onBack, speak }) => {
  const [quizData, setQuizData] = useState({
    categories: ['Math', 'Science', 'Colors'],
    currentCategory: 'Math',
    currentQuestion: 0,
    score: 0,
    questions: {
      Math: [
        { question: 'What is 2 + 2?', options: ['3', '4', '5'], correct: 1, image: 'https://static.vecteezy.com/system/resources/previews/001/942/017/non_2x/group-of-four-animals-cartoon-characters-vector.jpg', explanation: 'Two plus two equals four.' },
        { question: 'What is 5 - 3?', options: ['1', '2', '3'], correct: 1, image: 'https://i.pinimg.com/736x/75/42/dc/7542dcbf7fdaf4402b7a089da29c4d32.jpg', explanation: 'Five minus three equals two.' },
        { question: 'What is 3 × 2?', options: ['5', '6', '7'], correct: 1, image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Dissected_rectangle-3x2.png', explanation: 'Three times two equals six.' }
      ],
      Science: [
        { question: 'What color is the sky?', options: ['Red', 'Blue', 'Green'], correct: 1, image: 'https://i.pinimg.com/originals/24/08/73/240873ffd25b81318a3093f4560787ca.gif', explanation: 'The sky is blue because of sunlight.' },
        { question: 'How many legs does a cat have?', options: ['2', '4', '6'], correct: 1, image: 'https://assets.dochipo.com/editor/animations/cat/7f35e703-ad26-45cd-8f4f-62da09bb22e4.gif', explanation: 'Cats have four legs to run and jump!' },
        { question: 'What do plants need to grow?', options: ['Water', 'Fire', 'Ice'], correct: 0, image: 'https://media.giphy.com/media/d9Hhu2N1KTF0uW76WQ/giphy.gif', explanation: 'Plants love water and sunshine!' }
      ],
      Colors: [
        { question: 'Mixing red and blue makes?', options: ['Purple', 'Green', 'Yellow'], correct: 0, image: 'https://i.pinimg.com/originals/9b/36/b6/9b36b69686dbfc694ec7cb567fa6356b.gif', explanation: 'Red and Blue make Purple!' },
        { question: 'What color is the sun?', options: ['Blue', 'Yellow', 'Green'], correct: 1, image: 'https://i.pinimg.com/originals/46/86/f3/4686f30f3b88a46402b5dcd14bd6d777.gif', explanation: 'The sun looks yellow and bright!' },
        { question: 'What color are most leaves?', options: ['Red', 'Blue', 'Green'], correct: 2, image: 'https://i.pinimg.com/originals/3e/41/9d/3e419de254373fda06cd9a8213f77366.gif', explanation: 'Leaves are usually green!' }
      ]
    }
  });
  const [showQuizExplanation, setShowQuizExplanation] = useState(null);

  const handleAnswerSelect = async (answerIndex) => {
    const currentQ = quizData.questions[quizData.currentCategory][quizData.currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    setShowQuizExplanation({ correct: isCorrect, explanation: currentQ.explanation });
    
    if (isCorrect) await speak('Yay! That is correct! ' + currentQ.explanation);
    else await speak('Oopsie. ' + currentQ.explanation);
    
    setTimeout(() => {
      setQuizData(prev => ({ ...prev, score: isCorrect ? prev.score + 1 : prev.score, currentQuestion: prev.currentQuestion + 1 }));
      setShowQuizExplanation(null);
    }, 3500);
  };

  const resetQuiz = () => {
    setQuizData(prev => ({ ...prev, currentQuestion: 0, score: 0 }));
    setShowQuizExplanation(null);
    speak('Let\'s play again!');
  };

  const currentQ = quizData.questions[quizData.currentCategory][quizData.currentQuestion];
  const isQuizComplete = quizData.currentQuestion >= quizData.questions[quizData.currentCategory].length;

  if (isQuizComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.navHeader}>
            <TouchableOpacity style={styles.navBack} onPress={onBack}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
            <Text style={styles.navTitle}>You Finished!</Text>
          </View>
          <View style={[styles.card, { alignItems: 'center', marginTop: 20 }]}>
            <Text style={{fontSize: 60}}>🏆</Text>
            <Text style={styles.resultBig}>You did it!</Text>
            <Text style={styles.resultScore}>Score: {quizData.score} out of {quizData.questions[quizData.currentCategory].length}</Text>
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: THEME.success, width: '100%', marginTop: 20}]} onPress={resetQuiz}><Text style={styles.actionButtonText}>Play Again</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: THEME.secondary, width: '100%', marginTop: 10}]} onPress={onBack}><Text style={styles.actionButtonText}>Go Home</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.navBack} onPress={onBack}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
          <Text style={styles.navTitle}>Fun Quiz</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 15}}>
          {quizData.categories.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setQuizData(prev => ({...prev, currentCategory: cat, currentQuestion: 0, score: 0}))} style={[styles.pillButton, quizData.currentCategory === cat ? {backgroundColor: THEME.primary} : {backgroundColor: 'white'}]}>
              <Text style={[styles.pillText, quizData.currentCategory === cat ? {color: 'white'} : {color: THEME.text}]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.questionCard}>
          <Image source={{ uri: currentQ.image }} style={styles.questionImage} resizeMode="cover" />
          <Text style={styles.questionText}>{currentQ.question}</Text>
          <TouchableOpacity style={styles.speakerIcon} onPress={() => speak(currentQ.question)}><Ionicons name="volume-high" size={30} color={THEME.primary} /></TouchableOpacity>
          {!showQuizExplanation ? (
            <View style={{gap: 10, width: '100%'}}>
              {currentQ.options.map((opt, i) => (
                <TouchableOpacity key={i} style={styles.optionButton} onPress={() => handleAnswerSelect(i)}><Text style={styles.optionText}>{opt}</Text></TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.feedbackBox, showQuizExplanation.correct ? {borderColor: THEME.success} : {borderColor: THEME.accent}]}>
              <Text style={{fontSize: 40}}>{showQuizExplanation.correct ? '🎉' : '🤔'}</Text>
              <Text style={styles.feedbackText}>{showQuizExplanation.explanation}</Text>
            </View>
          )}
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
  pillButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: THEME.primary },
  pillText: { fontWeight: 'bold' },
  questionCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 3, borderColor: THEME.secondary, alignItems: 'center' },
  questionImage: { width: '100%', height: 180, borderRadius: 15, marginBottom: 15 },
  questionText: { fontSize: 24, fontWeight: 'bold', color: THEME.text, textAlign: 'center', marginBottom: 10 },
  speakerIcon: { backgroundColor: '#E1F5FE', padding: 10, borderRadius: 30, marginBottom: 20 },
  optionButton: { backgroundColor: 'white', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#B0BEC5', width: '100%', alignItems: 'center' },
  optionText: { fontSize: 18, fontWeight: 'bold', color: THEME.text },
  feedbackBox: { borderWidth: 4, borderRadius: 15, padding: 20, alignItems: 'center', width: '100%', backgroundColor: '#FAFAFA' },
  feedbackText: { fontSize: 18, textAlign: 'center', marginTop: 10, fontWeight: 'bold', color: THEME.text },
  resultBig: { fontSize: 32, fontWeight: '900', color: THEME.primary, marginVertical: 10 },
  resultScore: { fontSize: 20, fontWeight: 'bold', color: THEME.text },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 3, borderColor: '#B3E5FC', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  actionButton: { padding: 15, borderRadius: 25, alignItems: 'center', borderBottomWidth: 5, borderColor: 'rgba(0,0,0,0.2)' },
  actionButtonText: { color: 'white', fontSize: 20, fontWeight: '900' },
});

export default QuizScreen;