import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { COLORS } from '../../constants/theme';

import { useFonts } from '@expo-google-fonts/dm-sans';
import {
  DMSans_100Thin,
  DMSans_200ExtraLight,
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
  DMSans_900Black,
  DMSans_100Thin_Italic,
  DMSans_200ExtraLight_Italic,
  DMSans_300Light_Italic,
  DMSans_400Regular_Italic,
  DMSans_500Medium_Italic,
  DMSans_600SemiBold_Italic,
  DMSans_700Bold_Italic,
  DMSans_800ExtraBold_Italic,
  DMSans_900Black_Italic,
} from '@expo-google-fonts/dm-sans';

import '../../styles/global.css';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';

export default function MainLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_100Thin,
    DMSans_200ExtraLight,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
    DMSans_900Black,
    DMSans_100Thin_Italic,
    DMSans_200ExtraLight_Italic,
    DMSans_300Light_Italic,
    DMSans_400Regular_Italic,
    DMSans_500Medium_Italic,
    DMSans_600SemiBold_Italic,
    DMSans_700Bold_Italic,
    DMSans_800ExtraBold_Italic,
    DMSans_900Black_Italic,
  });

  if (!fontsLoaded) {
    return null; // Ou um spinner de carregamento
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentRow}>
        <Sidebar />
        <View style={styles.mainContent}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
});
