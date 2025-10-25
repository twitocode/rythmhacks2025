import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AddScreen() {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
      console.error(error);
    }
  };

  return (
    <ScrollView>
        <ThemedView style={styles.header}>
            <ThemedText type="title">Add Flashcards</ThemedText>
        </ThemedView>
        <ThemedView style={styles.content}>
            <ThemedText type="subtitle">Upload a file</ThemedText>

            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <ThemedText style={styles.uploadButtonText}>Choose File</ThemedText>
            </TouchableOpacity>

            {selectedFile && (
              <ThemedView style={styles.fileInfo}>
                <ThemedText>Selected file:</ThemedText>
                <ThemedText style={styles.fileName}>{selectedFile.name}</ThemedText>
                <ThemedText>Size: {(selectedFile.size! / 1024).toFixed(2)} KB</ThemedText>
              </ThemedView>
            )}
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
    uploadButton: {
        backgroundColor: '#0a7ea4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fileInfo: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    fileName: {
        fontWeight: 'bold',
        marginVertical: 5,
    },
});
