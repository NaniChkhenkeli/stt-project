import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import ParametersSheet from '@/components/ParametersSheet';

export default function YoutubeScreen() {
  const [url, setUrl] = useState('');
  const [paramsVisible, setParamsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.screenLabel}>მთავარი გვერდი</Text>


      {/* YouTube URL input */}
      <View style={styles.inputWrap}>
        <FontAwesome5 name="youtube" size={20} color="#FF0000" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="YouTube ლინკი..."
          placeholderTextColor="#bbb"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>ტრანსკრიფცია</Text>
      </TouchableOpacity>

      <ParametersSheet visible={paramsVisible} onClose={() => setParamsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#fff' },
  screenLabel:    { fontSize: 11, color: '#fff', paddingHorizontal: 16, paddingTop: 8 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  title:          { fontSize: 17, fontWeight: '600' },
  actionRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  primaryBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4A90E2', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8 },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  paramsBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8 },
  paramsBtnText:  { fontSize: 14, color: '#333' },
  inputWrap:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 20, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  input:          { flex: 1, fontSize: 14, color: '#333' },
  submitBtn:      { marginHorizontal: 16, marginTop: 14, backgroundColor: '#4A90E2', paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  submitText:     { color: '#fff', fontSize: 15, fontWeight: '600' },
});