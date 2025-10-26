import React from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CountdownTimer from '@/components/timer';

const VIDEO_IDS = [
  '9q6eL3iSATM',
  'rG7nFkPxg-E',
  'lgox5KTyzdc',
  '8HhzRd9taEU',
  'ngVWupHJzBY',
  '1T-TOErazVs'
];

export default function HomeScreen() {
  const [videoId, setVideoId] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * VIDEO_IDS.length);
    return VIDEO_IDS[randomIndex];
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
        <YoutubePlayer
          height={250}
          play={true}
          videoId={videoId}
          initialPlayerParams={{
            preventFullScreen: false,
            controls: true,
            modestbranding: true,
          }}
        />
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
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
  videoSection: {
    padding: 20,
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
    overflow: 'hidden',
  },
  visible: {
    opacity: 1,
  },
});
