import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Constants from "expo-constants";

const { manifest2 } = Constants;

const uri =
  Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":8000");

// TODO change this back later
// const SERVER_URL = 'http://100.100.61.15:8000';  Nick
const SERVER_URL = `http://192.168.254.227:8000`; //Toheeb

export default function AddScreen() {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      console.log("Uploading to:", `${SERVER_URL}/upload-pdf`);
      console.log("File:", selectedFile.name);

      // Test if server is reachable first
      const testResponse = await fetch(`${SERVER_URL}/`, { method: "GET" });
      console.log("Server reachable:", testResponse.ok);

      const formData = new FormData();
      formData.append("uploaded_file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || "application/pdf",
      } as any);

      const response = await fetch(`${SERVER_URL}/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();

      // Save flashcards to AsyncStorage
      if (data && Array.isArray(data)) {
        // Get existing cards
        const existingCardsJson = await AsyncStorage.getItem("cards");
        const existingCards = existingCardsJson
          ? JSON.parse(existingCardsJson)
          : [];

        // Merge new cards with existing ones
        const updatedCards = [...existingCards, ...data];
        // Save back to AsyncStorage
        await AsyncStorage.setItem("cards", JSON.stringify(updatedCards));

        Alert.alert(
          "Success",
          `${data.length} flashcards generated and saved!`
        );
        console.log("Saved cards:", updatedCards);
      } else {
        Alert.alert("Success", "Flashcards generated!");
        console.log(data);
      }

      setSelectedFile(null);
    } catch (error) {
      console.error("Full error:", error);
      Alert.alert("Error", `Failed to upload: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = async () => {
    Alert.alert(
      "Clear Storage",
      "Are you sure you want to delete all flashcards?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("cards");
              Alert.alert("Success", "All flashcards have been deleted");
            } catch (error) {
              Alert.alert("Error", "Failed to clear storage");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const previewCards = async () => {
    try {
      const cardsData = await AsyncStorage.getItem("cards");
      Alert.alert("Raw Storage Data", cardsData || "No data in storage");
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve storage data");
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
            <ThemedText>
              Size: {(selectedFile.size! / 1024).toFixed(2)} KB
            </ThemedText>
          </ThemedView>
        )}

        {selectedFile && (
          <TouchableOpacity
            style={[styles.uploadButton, styles.generateButton]}
            onPress={uploadFile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.uploadButtonText}>
                Upload & Generate Flashcards
              </ThemedText>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.uploadButton, styles.previewButton]}
          onPress={previewCards}
        >
          <ThemedText style={styles.uploadButtonText}>
            Preview Raw Storage Data
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, styles.clearButton]}
          onPress={clearStorage}
        >
          <ThemedText style={styles.uploadButtonText}>
            Clear All Flashcards
          </ThemedText>
        </TouchableOpacity>
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
});
