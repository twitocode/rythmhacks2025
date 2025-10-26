import { ThemedText } from "@/components/themed-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Flashcard from "./flashcard";
import { ThemedView } from "./themed-view";
import config from "@/config";


interface Card {
  Question: string;
  Answer: string;
  ratings?: number[];
}

export default function CountdownTimer() {
  const delay = 12;
  const [seconds, setSeconds] = useState(delay);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [flashcardKey, setFlashcardKey] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [ratings, setRatings] = useState<
    { question: string; difficulty: number }[]
  >([]);

  const getRandomCard = async () => {
    try {
      const cardsJson = await AsyncStorage.getItem("cards");
      if (cardsJson) {
        const cards: Card[] = JSON.parse(cardsJson);
        if (cards.length > 0) {
          const randomIndex = Math.floor(Math.random() * cards.length);
          setCurrentCard(cards[randomIndex]);
        }
      }
    } catch (error) {
      console.error("Error loading flashcards:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 1) return prev - 1;
        if (prev === 1) {
          getRandomCard();
          setShowFlashcard(true);
          setFlashcardKey((k) => k + 1);
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

  const handleRating = async (difficulty: 1 | 2 | 3) => {
    if (currentCard) {
      setRatings([...ratings, { question: currentCard.Question, difficulty }]);
      console.log("Ratings:", [
        ...ratings,
        { question: currentCard.Question, difficulty },
      ]);

      console.log(currentCard);
      const withoutQuestionMark =currentCard.Question.substring(0, currentCard.Question.length -1)
        console.log(withoutQuestionMark);
        
      const res = await fetch(
        `${config.SERVER_URL}/ai/question/review?question=${"hey"}&quality=${difficulty}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      console.log(data);
    }
  };

  return (
    <ThemedView>
      <ThemedText type="title">{seconds}</ThemedText>

      {currentCard && (
        <Flashcard
          key={flashcardKey}
          question={currentCard.Question}
          answer={currentCard.Answer}
          onReset={resetTimer}
          onHide={hideFlashcard}
          visible={showFlashcard}
          onRate={handleRating}
        />
      )}
    </ThemedView>
  );
}
