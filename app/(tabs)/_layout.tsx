import React from 'react';
import { Tabs, router } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRecording } from '../_layout';

const BLUE = '#4A90E2';
const RED  = '#E53935';

function CenterButton() {
  const { isRecording, startRecording, stopRecording } = useRecording();

  const handlePress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      router.navigate('/(tabs)/record');
      await startRecording();
    }
  };

  return (
    <View style={s.wrap}>
      <TouchableOpacity
        style={[s.btn, isRecording ? s.stop : s.mic]}
        onPress={handlePress}
      >
        {isRecording
          ? <View style={s.square} />
          : <Ionicons name="mic" size={30} color="#fff" />
        }
      </TouchableOpacity>
      <Text style={[s.label, isRecording && { color: RED }]}>
        {isRecording ? 'შეჩერება' : 'ჩანაწერი'}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
          height: 72,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'აუდიო ფაილი',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="insert-drive-file" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="record"
        options={{
          tabBarButton: () => <CenterButton />,
        }}
      />

      <Tabs.Screen
        name="youtube"
        options={{
          title: 'YouTube Link',
          tabBarIcon: () => <FontAwesome5 name="youtube" size={24} color="#FF0000" />,
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 10, color: focused ? BLUE : '#aaa' }}>YouTube Link</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  wrap:   { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 4 },
  btn:    { width: 62, height: 62, borderRadius: 31, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  mic:    { backgroundColor: BLUE, shadowColor: BLUE },
  stop:   { backgroundColor: RED,  shadowColor: RED  },
  square: { width: 22, height: 22, borderRadius: 4, backgroundColor: '#fff' },
  label:  { fontSize: 10, color: '#aaa', marginTop: 3 },
});