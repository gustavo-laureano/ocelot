import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Carousel from '@/components/layout/Carousel';
import WeeklyCalendar from '@/components/layout/Calendar';
import RankingWidget from '@/components/layout/Ranking';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/theme';

function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    };
    checkToken();
  }, [router]);
}

useAuthRedirect();

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        {/* Esquerda: Carousel em cima, Calendar embaixo */}
          <Carousel />
          <View style={{ marginTop: 16 }}>
            <RankingWidget />
            <WeeklyCalendar
              onDateSelect={function (date: Date): void {
                throw new Error('Function not implemented.');
              }}
            />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  leftSide: {
    flex: 1,
    marginRight: 16,
    minWidth: 250,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
    alignSelf: 'stretch',
  },
  rightSide: {
    width: 220,
    flexShrink: 0,
  },
});

