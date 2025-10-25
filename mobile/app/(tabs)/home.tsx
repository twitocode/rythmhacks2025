import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CountdownTimer from '@/components/timer';

export default function HomeScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Study Flow</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <CountdownTimer />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
});
