import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ParametersSheet from '@/components/ParametersSheet';

export default function HomeScreen() {
  const [paramsVisible, setParamsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>ხმა ⇌ ტექსტი</Text>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* action row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.primaryBtnText}>ახლის გახსნა</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paramsBtn} onPress={() => setParamsVisible(true)}>
          <Ionicons name="settings-outline" size={15} color="#555" />
          <Text style={styles.paramsBtnText}>პარამეტრები</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.hint}>
        <Ionicons name="mic-outline" size={20} color="#4A90E2" />
        <Text style={styles.hintText}>დაიწყე ჩაწერა...</Text>
      </View>

      <ParametersSheet visible={paramsVisible} onClose={() => setParamsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#fff' },
  screenLabel:   { fontSize: 11, color: '#aaa', paddingHorizontal: 16, paddingTop: 8 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  title:         { fontSize: 17, fontWeight: '600' },
  divider:        { height: 1, backgroundColor: '#eee', marginHorizontal: 16, marginBottom: 10 },

  actionRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  primaryBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4A90E2', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8 },
  primaryBtnText:{ color: '#fff', fontSize: 14, fontWeight: '500' },
  paramsBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#4e5fa5', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8 },
  paramsBtnText: { fontSize: 14, color: '#333' },
  hint:          { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingTop: 6 },
  hintText:      { color: '#161616', fontSize: 14 },
});