import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const HISTORY_DATA = [
  {
    section: 'დღეს',
    items: [
      { id: '1', text: 'ტრანსკრიფციის სერვისი ხმა ტექსტად გარდაქმნის სწრაფად და მარტივად. მომხმარებელს...' },
      { id: '2', text: 'ტრანსკრიფციის სერვისი ხმა ტექსტად გარდაქმნის სწრაფად და მარტივად. მომხმარებელს...' },
    ],
  },
  {
    section: 'გუშინ',
    items: [
      { id: '3', text: 'ტრანსკრიფციის სერვისი ხმა ტექსტად გარდაქმნის სწრაფად და მარტივად. მომხმარებელს...' },
      { id: '4', text: 'ტრანსკრიფციის სერვისი ხმა ტექსტად გარდაქმნის სწრაფად და მარტივად. მომხმარებელს...' },
    ],
  },
  {
    section: '11 მარტი',
    items: [
      { id: '5', text: 'ტრანსკრიფციის სერვისი ხმა ტექსტად გარდაქმნის სწრაფად და მარტივად. მომხმარებელს...' },
      { id: '6', text: 'ტრანსკრიფციის სერვისი ხმა ტექსტად გარდაქმნის სწრაფად და მარტივად. მომხმარებელს...' },
    ],
  },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.screenLabel}>ისტორიის გვერდი</Text>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View>
            <Text style={styles.email}>achi.terushvili777@gmail.com</Text>
            <View style={styles.proTag}>
              <Text style={styles.proText}>პრემიუმ</Text>
            </View>
          </View>
        </View>

        {/* Georgian flag inline */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 19 }}>🇬🇪</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-down" size={24} color="#211a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* History List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {HISTORY_DATA.map((group, gi) => (
          <View key={gi}>
            <Text style={styles.groupLabel}>{group.section}</Text>
            {group.items.map(item => (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="pencil-outline" size={16} color="#5B8DEF" />
                </TouchableOpacity>
                <Text style={styles.cardText} numberOfLines={2}>
                  {item.text}
                </Text>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={16} color="#bbb" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenLabel: {
    fontSize: 11,
    color: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c0d356',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  email: {
    fontSize: 12,
    color: '#222',
    fontWeight: '500',
  },
  proTag: {
    marginTop: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignSelf: 'flex-start',
  },
  proText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 20,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  groupLabel: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  iconBtn: {
    padding: 4,
  },
  cardText: {
    flex: 1,
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
    marginHorizontal: 6,
  },
});