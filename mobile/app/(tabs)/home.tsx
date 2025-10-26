import React from 'react';
import { ScrollView, StyleSheet, Dimensions, Button } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CountdownTimer from '@/components/timer';

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const VIDEOS = [
  require('@/assets/videos/1 Hour Of Brainrot Memes V1 - AlienMedia (720p, h264).mp4'),
  require('@/assets/videos/Instagram Reels Brainrot COMPILATION - Zeit (720p, h264).mp4'),
  require('@/assets/videos/Try not to laugh at brainrot compilation 10 - OrangeCatMemes (720p, h264).mp4'),
  require('@/assets/videos/ULTIMATE Brain Rot Quiz 2 - BrainRotBob (720p, h264).mp4'),
  require('@/assets/videos/brainrot insta reels that make me 🥀 - RartLmao (720p, h264).mp4'),
];

const VideoPlayer = ({ source }: { source: any }) => {
  const player = useVideoPlayer(source, player => {
    player.loop = true;
    player.play();
  });

  return <VideoView player={player} style={styles.video} nativeControls />;
};

export default function HomeScreen() {
  const [videoIndex, setVideoIndex] = React.useState(() =>
    Math.floor(Math.random() * VIDEOS.length)
  );

  const loadNewVideo = () => {
    let newIndex = Math.floor(Math.random() * VIDEOS.length);
    while (newIndex === videoIndex && VIDEOS.length > 1) {
      newIndex = Math.floor(Math.random() * VIDEOS.length);
    }
    setVideoIndex(newIndex);
  };

  return (
    <ScrollView>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Study Flow</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <CountdownTimer />
      </ThemedView>
      <ThemedView style={styles.videoSection}>
        <VideoPlayer key={videoIndex} source={VIDEOS[videoIndex]} />
        <Button title="Next Video" onPress={loadNewVideo} />
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
    height: screenHeight - 300,
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
