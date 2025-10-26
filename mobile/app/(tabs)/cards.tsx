import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import config from "@/config";


type Card = {
  Question: string;
  Answer: string;
  n: number;
  ef: number;
  interval: number;
  due_date: string;
};

export default function cards() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${config.SERVER_URL}/ai/questions`);
        const json = await response.json();

        setCards(json);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCards();
  }, []);

  const determineCardColour = (card: Card) => {
    // ef: 1.3 (hard) → red, 2.5 (easy) → green
    const minEF = 1.3;
    const maxEF = 2.5;
    const ratio = (card.ef - minEF) / (maxEF - minEF); // 0 → 1
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(100 * ratio + 55);
    return `rgb(${red}, ${green}, 0)`; // gradient from red to green
  };

  return (
    <ScrollView>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Your Flashcards</ThemedText>
      </ThemedView>
      <View style={styles.cardsList}>
        {cards.sort().map((card, index) => (
          <View
            key={index}
            style={{
              ...styles.card,
              marginTop: index == 0 ? 10 : 0,
              backgroundColor: card.n > 1 ? determineCardColour(card) : "#4b4a4aff",
            }}
          >
            <ThemedText style={styles.cardTitle}>{card.Question}</ThemedText>
            <ThemedText>Due next on {card.due_date}</ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  content: {
    padding: 20,
  },
  uploadButton: {
    backgroundColor: "#0a7ea4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileInfo: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  fileName: {
    fontWeight: "bold",
    marginVertical: 5,
  },
  generateButton: {
    backgroundColor: "#10a37f",
  },
  previewButton: {
    backgroundColor: "#6b7280",
  },
  clearButton: {
    backgroundColor: "#dc2626",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardsList: {
    display: "flex",
    rowGap: "40px",
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
