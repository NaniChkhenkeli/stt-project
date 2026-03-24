import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ParametersSheet from '@/components/ParametersSheet';
import { useRecording } from '../_layout';

//  audio player 
function AudioPlayer({ uri }: { uri: string }) {
  const [sound,    setSound]    = useState<Audio.Sound | null>(null);
  const [playing,  setPlaying]  = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    let s: Audio.Sound;
    (async () => {
      try {
        const { sound: loaded } = await Audio.Sound.createAsync(
          { uri }, { shouldPlay: false },
          status => {
            if (!status.isLoaded) return;
            setPosition(status.positionMillis);
            setDuration(status.durationMillis ?? 1);
            if (status.didJustFinish) setPlaying(false);
          }
        );
        s = loaded; setSound(loaded);
      } catch {}
    })();
    return () => { s?.unloadAsync(); };
  }, [uri]);

  const toggle = async () => {
    if (!sound) return;
    if (playing) { await sound.pauseAsync(); setPlaying(false); }
    else         { await sound.playAsync();  setPlaying(true);  }
  };

  const fmt = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    return `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;
  };

  const progress = Math.min(position / duration, 1);

  return (
    <View style={ap.wrap}>
      <TouchableOpacity style={ap.playBtn} onPress={toggle}>
        <Ionicons name={playing ? 'pause' : 'play'} size={18} color="#fff" />
      </TouchableOpacity>
      <View style={ap.right}>
        <View style={ap.track}>
          <View style={[ap.filled, { width: `${progress * 100}%` }]} />
          <View style={[ap.thumb,  { left:  `${progress * 100}%` }]} />
        </View>
        <Text style={ap.time}>{fmt(position)}</Text>
      </View>
    </View>
  );
}

const ap = StyleSheet.create({
  wrap:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 10, backgroundColor: '#f0f0f0', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 8, gap: 10 },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center' },
  right:   { flex: 1 },
  track:   { height: 4, backgroundColor: '#d5d5d5', borderRadius: 2, position: 'relative', justifyContent: 'center' },
  filled:  { position: 'absolute', left: 0, height: 4, backgroundColor: '#4A90E2', borderRadius: 2 },
  thumb:   { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: '#4A90E2', marginLeft: -6, top: -4 },
  time:    { fontSize: 11, color: '#888', marginTop: 3 },
});

// screen 
export default function RecordScreen() {
  const [paramsVisible, setParamsVisible] = useState(false);
  const { isRecording, recordingUri, transcript, elapsed } = useRecording();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (transcript) scrollRef.current?.scrollToEnd({ animated: true });
  }, [transcript]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const hasText = transcript.length > 0;

  return (
    <SafeAreaView style={st.safe}>
      <Text style={st.screenLabel}>მთავარი გვერდი</Text>

      <View style={st.header}>
        <Text style={st.title}>ხმა ⇌ ტექსტი</Text>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={st.divider} />

      <View style={st.actionRow}>
        <TouchableOpacity style={st.primaryBtn}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={st.primaryBtnText}>ახლის გახსნა</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.paramsBtn} onPress={() => setParamsVisible(true)}>
          <Ionicons name="settings-outline" size={15} color="#555" />
          <Text style={st.paramsBtnText}>პარამეტრები</Text>
        </TouchableOpacity>
      </View>

      {!hasText && (
        <View style={st.hint}>
          <Ionicons
            name={isRecording ? 'radio-button-on' : 'mic-outline'}
            size={16} color={isRecording ? '#E53935' : '#4A90E2'}
          />
          <Text style={[st.hintText, isRecording && { color: '#E53935' }]}>
            {isRecording ? `ჩაწერა მიმდინარეობს... ${fmt(elapsed)}` : 'დაიწყე ჩაწერა...'}
          </Text>
        </View>
      )}

      {hasText && (
        <ScrollView ref={scrollRef} style={st.scroll} contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
          {isRecording && (
            <View style={st.badge}>
              <Ionicons name="radio-button-on" size={11} color="#E53935" />
              <Text style={st.badgeText}>{fmt(elapsed)}</Text>
            </View>
          )}
          <Text style={st.transcriptText}>{transcript}</Text>
        </ScrollView>
      )}

      {!hasText && <View style={{ flex: 1 }} />}

      {recordingUri && !isRecording && <AudioPlayer uri={recordingUri} />}

      <ParametersSheet visible={paramsVisible} onClose={() => setParamsVisible(false)} />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#fff' },
  screenLabel:    { fontSize: 11, color: '#fff', paddingHorizontal: 16, paddingTop: 8 },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  title:          { fontSize: 17, fontWeight: '600' },
  divider:        { height: 1, backgroundColor: '#eee', marginHorizontal: 16, marginBottom: 10 },

  actionRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  primaryBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4A90E2', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8 },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  paramsBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 8 },
  paramsBtnText:  { fontSize: 14, color: '#333' },
  hint:           { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingTop: 4 },
  hintText:       { color: '#bbb', fontSize: 14 },
  scroll:         { flex: 1, marginHorizontal: 16, marginTop: 6 },
  badge:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  badgeText:      { fontSize: 12, color: '#E53935', fontWeight: '600' },
  transcriptText: { fontSize: 15, color: '#222', lineHeight: 26 },
});