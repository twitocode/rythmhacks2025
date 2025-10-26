import { ThemedText } from '@/components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import Flashcard from './flashcard';
import { ThemedView } from './themed-view';

interface Card {
  Question: string;
  Answer: string;
}

export default function CountdownTimer() {
  const delay = 5
  const [seconds, setSeconds] = useState(delay);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [flashcardKey, setFlashcardKey] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  const getRandomCard = async () => {
    try {
      const cardsJson = await AsyncStorage.getItem('cards');
      console.log('Retrieved cards from storage:', cardsJson);
      if (cardsJson) {
        const cards: Card[] = JSON.parse(cardsJson);
        if (cards.length > 0) {
          const randomIndex = Math.floor(Math.random() * cards.length);
          setCurrentCard(cards[randomIndex]);
        }
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) return prev - 1;
        if (prev === 1) {
          getRandomCard();
          console.log(currentCard);
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
      {showFlashcard && currentCard && (
        <Flashcard
          key={flashcardKey}
          question={currentCard.Question}
          answer={currentCard.Answer}
          onReset={resetTimer}
          onHide={hideFlashcard}
        />
      )}
    </ThemedView>
  );
}