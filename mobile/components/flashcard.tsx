import { ThemedText } from '@/components/themed-text';
import { Button } from '@react-navigation/elements';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';

export default function Flashcard({ question, answer, onReset, onHide }: any) {
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
                    {question}
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
                        {answer}
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

