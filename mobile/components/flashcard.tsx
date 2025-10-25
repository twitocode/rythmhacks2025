import { ThemedText } from '@/components/themed-text';
import { Button } from '@react-navigation/elements';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';

export default function Flashcard({ onReset, onHide }: any) {
    const [showQuestion, setShowQuestion] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleReveal = () => {
        setShowButton(false);
        setShowAnswer(true);
        onReset();
        setTimeout(() => {
            onHide();
        }, 3000);
    };

    return (
        <ThemedView style={styles.flashcardContainer}>
            {showQuestion && (
                <ThemedText type="title">
                    What is the mitochondria?
                </ThemedText>
            )}
            {showButton && (
                <>
                    <Button onPress={handleReveal}>Reveal</Button>
                </>
            )}
            {showAnswer && (
                <>
                    <ThemedText>
                        The powerhouse of the cell
                    </ThemedText>
                </>
            )}

        </ThemedView>
    );
}


const styles = StyleSheet.create({
  flashcardContainer: {
    marginTop: 50,
  }
});

