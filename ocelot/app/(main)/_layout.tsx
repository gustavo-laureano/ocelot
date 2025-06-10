import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

// Importe os componentes de layout que você já tem
import Header from '../../components/layout/Header'; // O caminho pode precisar de ajuste
import Sidebar from '../../components/layout/Sidebar'; // Crie este componente se ainda não o fez

export default function MainLayout() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentRow}>
        <Sidebar />
        <View style={styles.mainContent}>
          {/* O <Slot /> é o lugar mágico onde o Expo Router vai renderizar
              a tela da rota atual (index.tsx, projects/index.tsx, etc.) */}
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2A6C', // Sua cor de fundo
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
});
