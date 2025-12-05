import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  TextInput, Alert, Modal, Platform, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

const RoutineScreen = ({ onBack, speak }) => {
  const [routines, setRoutines] = useState([
    { id: 1, task: 'Brush teeth', time: 'Today, 08:00 AM', completed: false },
    { id: 2, task: 'Take medicine', time: 'Today, 12:00 PM', completed: false },
    { id: 3, task: 'Study time', time: 'Today, 03:00 PM', completed: false }
  ]);

  const [newRoutine, setNewRoutine] = useState({ task: '', time: '' });
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSelection, setPickerSelection] = useState({
    date: new Date(),
    hour: 8,
    minute: 0,
    isAm: true
  });

  const handleCreateRoutine = async () => {
    if (newRoutine.task.trim() && newRoutine.time.trim()) {
      const newItem = { id: Date.now(), task: newRoutine.task.trim(), time: newRoutine.time.trim(), completed: false };
      setRoutines(prev => [...prev, newItem]);
      setNewRoutine({ task: '', time: '' });
      speak('Added!');
    } else {
      Alert.alert('Oops', 'Need a name and time!');
    }
  };

  const handleDeleteRoutine = (id) => {
    if (Platform.OS === 'web') {
      if (confirm('Delete this task?')) setRoutines(prev => prev.filter(r => r.id !== id));
    } else {
      Alert.alert('Delete?', 'Remove this task?', [
        { text: 'No' },
        { text: 'Yes', onPress: () => setRoutines(prev => prev.filter(r => r.id !== id)) }
      ]);
    }
  };

  const confirmTimeSelection = () => {
    const min = pickerSelection.minute < 10 ? `0${pickerSelection.minute}` : pickerSelection.minute;
    const hr = pickerSelection.hour;
    const ampm = pickerSelection.isAm ? 'AM' : 'PM';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = pickerSelection.date.toLocaleDateString('en-US', options);
    setNewRoutine(prev => ({ ...prev, time: `${dateStr}, ${hr}:${min} ${ampm}` }));
    setShowPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.navBack} onPress={onBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>My Schedule</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF9C4', borderColor: '#FBC02D' }]}>
          <Text style={styles.cardHeaderTitle}>{editingRoutine ? 'Fix Task' : 'New Task'}</Text>
          <View style={styles.kidInputRow}>
            <Ionicons name="create" size={24} color={THEME.text} />
            <TextInput style={styles.kidInput} placeholder="What to do?" value={newRoutine.task} onChangeText={t => setNewRoutine(p => ({...p, task: t}))} />
          </View>
          <TouchableOpacity style={styles.kidInputRow} onPress={() => setShowPicker(true)}>
            <Ionicons name="time" size={24} color={THEME.text} />
            <Text style={[styles.kidInput, !newRoutine.time && {color: '#999', paddingTop: 3}]}>{newRoutine.time || "When?"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: THEME.success, width: '100%'}]} onPress={editingRoutine ? () => { setRoutines(p => p.map(r => r.id === editingRoutine.id ? {...r, task: newRoutine.task, time: newRoutine.time} : r)); setEditingRoutine(null); setNewRoutine({task:'', time:''}); } : handleCreateRoutine}>
            <Text style={styles.actionButtonText}>{editingRoutine ? 'Save Fix' : 'Add It!'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 20}}>
          {routines.map(r => (
            <View key={r.id} style={[styles.taskItem, r.completed && {opacity: 0.7}]}>
              <TouchableOpacity onPress={() => setRoutines(p => p.map(x => x.id === r.id ? {...x, completed: !x.completed} : x))}>
                <Ionicons name={r.completed ? "checkbox" : "square-outline"} size={34} color={r.completed ? THEME.success : THEME.primary} />
              </TouchableOpacity>
              <View style={{flex: 1, paddingHorizontal: 10}}>
                <Text style={[styles.taskTitle, r.completed && {textDecorationLine: 'line-through'}]}>{r.task}</Text>
                <Text style={styles.taskTime}>{r.time}</Text>
              </View>
              <View style={{flexDirection: 'row', gap: 5}}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => { setEditingRoutine(r); setNewRoutine({task: r.task, time: r.time}); }}><Ionicons name="pencil" size={20} color="white" /></TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, {backgroundColor: THEME.accent}]} onPress={() => handleDeleteRoutine(r.id)}><Ionicons name="trash" size={20} color="white" /></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Modal transparent visible={showPicker} onRequestClose={() => setShowPicker(false)}>
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Pick a Time!</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20}}>
                <TouchableOpacity style={styles.pickerArrow} onPress={() => setPickerSelection(p => ({...p, hour: p.hour === 12 ? 1 : p.hour + 1}))}><Ionicons name="caret-up" size={30} color="white"/></TouchableOpacity>
                <Text style={styles.timeBig}>{pickerSelection.hour}</Text>
                <Text style={styles.timeBig}>:</Text>
                <TouchableOpacity style={styles.pickerArrow} onPress={() => setPickerSelection(p => ({...p, minute: (p.minute + 5) % 60}))}><Ionicons name="caret-up" size={30} color="white"/></TouchableOpacity>
                <Text style={styles.timeBig}>{pickerSelection.minute < 10 ? '0'+pickerSelection.minute : pickerSelection.minute}</Text>
                <TouchableOpacity style={[styles.ampmSwitch, {backgroundColor: pickerSelection.isAm ? THEME.secondary : THEME.text}]} onPress={() => setPickerSelection(p => ({...p, isAm: !p.isAm}))}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>{pickerSelection.isAm ? 'AM' : 'PM'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={[styles.actionButton, {backgroundColor: THEME.primary, width: '100%'}]} onPress={confirmTimeSelection}>
                <Text style={styles.actionButtonText}>Done!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  cardHeaderTitle: { fontSize: 22, fontWeight: '900', color: THEME.text, marginBottom: 15, textAlign: 'center' },
  kidInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 15, borderWidth: 2, borderColor: '#DDD', marginBottom: 10 },
  kidInput: { flex: 1, fontSize: 18, marginLeft: 10, color: THEME.text, fontWeight: '600' },
  actionButton: { padding: 15, borderRadius: 25, alignItems: 'center', borderBottomWidth: 5, borderColor: 'rgba(0,0,0,0.2)' },
  actionButtonText: { color: 'white', fontSize: 20, fontWeight: '900' },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 2, borderColor: '#E0E0E0' },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.text },
  taskTime: { fontSize: 14, color: '#888' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: 'white', borderRadius: 25, padding: 25, alignItems: 'center', borderWidth: 4, borderColor: THEME.primary },
  modalTitle: { fontSize: 24, fontWeight: '900', color: THEME.text },
  timeBig: { fontSize: 50, fontWeight: '900', color: THEME.text, marginHorizontal: 5 },
  pickerArrow: { backgroundColor: THEME.primary, borderRadius: 10, padding: 5 },
  ampmSwitch: { padding: 10, borderRadius: 10, marginLeft: 10 },
});

export default RoutineScreen;