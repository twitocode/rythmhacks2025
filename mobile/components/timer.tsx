import { ThemedText } from '@/components/themed-text';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Flashcard from './flashcard';
import { ThemedView } from './themed-view';

export default function CountdownTimer() {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView>
      <ThemedText type="title">{seconds}</ThemedText>
      {seconds === 0 && <Flashcard />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
});