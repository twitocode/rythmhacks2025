import { ThemedText } from '@/components/themed-text';
import { Button } from '@react-navigation/elements';
import React, { useState } from 'react';
import { StyleSheet, Modal, View, Pressable, useColorScheme } from 'react-native';
import { ThemedView } from './themed-view';
import { Colors } from '@/constants/theme';

interface FlashcardProps {
  question: string;
  answer: string;
  onReset: () => void;
  onHide: () => void;
  visible: boolean;
  onRate?: (difficulty: 1 | 2 | 3) => void;
}

export default function Flashcard({ question, answer, onReset, onHide, visible, onRate }: FlashcardProps) {
    const [showButton, setShowButton] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const colorScheme = useColorScheme();

    const handleReveal = () => {
        setShowButton(false);
        setShowAnswer(true);
        onReset();
    };

    const handleRating = (difficulty: 1 | 2 | 3) => {
        onRate?.(difficulty);
        handleClose();
    };

    const handleClose = () => {
        setShowButton(true);
        setShowAnswer(false);
        onHide();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={showAnswer ? handleClose : () => {}}
        >
            <Pressable style={styles.modalOverlay} onPress={showAnswer ? handleClose : () => {}}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    <ThemedView style={[styles.flashcardContainer, {
                        backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
                    }]}>
                        <ThemedText type="title" style={styles.question}>
                            {question}
                        </ThemedText>

                        {showButton && (
                            <View style={styles.buttonContainer}>
                                <Button onPress={handleReveal}>Reveal Answer</Button>
                            </View>
                        )}

                        {showAnswer && (
                            <>
                                <View style={styles.answerContainer}>
                                    <ThemedText style={styles.answer}>
                                        {answer}
                                    </ThemedText>
                                </View>

                                <View style={styles.ratingContainer}>
                                    <ThemedText style={styles.ratingPrompt}>
                                        How well did you remember?
                                    </ThemedText>
                                    <View style={styles.ratingButtons}>
                                        <Pressable
                                            style={[styles.ratingButton, styles.easyButton]}
                                            onPress={() => handleRating(1)}
                                        >
                                            <ThemedText style={styles.ratingButtonText}>Easy</ThemedText>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.ratingButton, styles.mediumButton]}
                                            onPress={() => handleRating(2)}
                                        >
                                            <ThemedText style={styles.ratingButtonText}>Medium</ThemedText>
                                        </Pressable>
                                        <Pressable
                                            style={[styles.ratingButton, styles.hardButton]}
                                            onPress={() => handleRating(3)}
                                        >
                                            <ThemedText style={styles.ratingButtonText}>Hard</ThemedText>
                                        </Pressable>
                                    </View>
                                </View>
                            </>
                        )}
                    </ThemedView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
  },
  flashcardContainer: {
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    minHeight: 250,
  },
  question: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  answerContainer: {
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.3)',
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  ratingContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.3)',
  },
  ratingPrompt: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardButton: {
    backgroundColor: '#ef4444',
  },
  mediumButton: {
    backgroundColor: '#f59e0b',
  },
  easyButton: {
    backgroundColor: '#22c55e',
  },
  ratingButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

