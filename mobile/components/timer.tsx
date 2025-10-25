import { ThemedText } from '@/components/themed-text';
import React, { useEffect, useState } from 'react';
import Flashcard from './flashcard';
import { ThemedView } from './themed-view';

export default function CountdownTimer() {
  const delay = 5
  const [seconds, setSeconds] = useState(delay);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [flashcardKey, setFlashcardKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) return prev - 1;
        if (prev === 1) {
          setShowFlashcard(true);
          setFlashcardKey(k => k + 1);
          return 0;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const resetTimer = () => {
    setSeconds(delay);
  };

  const hideFlashcard = () => {
    setShowFlashcard(false);
  };

  return (
    <ThemedView>
      <ThemedText type="title">{seconds}</ThemedText>
      {showFlashcard && <Flashcard key={flashcardKey} onReset={resetTimer} onHide={hideFlashcard} />}
    </ThemedView>
  );
}