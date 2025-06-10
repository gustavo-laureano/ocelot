import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Carousel from '@/components/layout/Carousel';
import CardHours from '@/components/layout/CardHours';
import CardGraph from '@/components/layout/CardGraph';

export default function DashboardScreen() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
           
      <Carousel/>
      <View style={styles.statsContainer}>
        <CardHours/>
        <CardGraph/>
      </View>

      <Text style={styles.placeholderText}>[Painel de Ranking]</Text>
     
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 0,
  },
  // Usei um estilo temporário para os placeholders
  placeholderText: {
    color: 'white', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 8,
    margin: 5,
    textAlign: 'center',
  }
});

