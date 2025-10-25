import { ThemedText } from '@/components/themed-text';
import { Button } from '@react-navigation/elements';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';

export default function Flashcard() {
    const [showButtons, setShowButtons] = useState(false)

    return (
        <ThemedView style={styles.flashcard_container}>
            <ThemedText type="title">
                What is the mitochondria?
            </ThemedText>
            {!showButtons && (
                <>
                    <Button onPress={() => setShowButtons(true)}>Reveal</Button>
                </>
            )}
            {showButtons && (
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
  flashcard_container: {
    marginTop: 50,
  }
});

