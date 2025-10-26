import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import CountdownTimer from "@/components/timer";
import { VideoView, useVideoPlayer } from "expo-video";
import React from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const VIDEOS = [
  require("@/assets/videos/Instagram Reels Brainrot COMPILATION - Zeit (720p, h264).mp4"),
];

export default function HomeScreen() {
  const [videoSource] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * VIDEOS.length);
    return VIDEOS[randomIndex];
  });

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <ScrollView>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Study Flow</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <CountdownTimer />
      </ThemedView>
      <ThemedView style={styles.videoSection}>
        <VideoView player={player} style={styles.video} nativeControls />
      </ThemedView>
      {/* <ThemedView style={styles.shortsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Study Shorts
        </ThemedText>
        <YouTubeShortsFeed
          shorts={[
            { id: 'TU67zsRolOo', title: 'Study Tips' },
          ]}
        />
      </ThemedView> */}
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
    padding: 10,
  },
  videoSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  video: {
    width: screenWidth - 40,
    height: screenHeight - 260,
  },
  shortsSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  hidden: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
  },
  visible: {
    opacity: 1,
  },
});
