// Localização: components/layout/Header.js
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logo}>Ocelot</Text>
      <View style={styles.menuItems}>
        <Link href="/(main)/myaccount" asChild>
          <Pressable>
            <Text style={styles.menuText}>Minha conta</Text>
          </Pressable>
        </Link>
        <Link href="/(main)/config" asChild>
          <Pressable>
            <Text style={styles.menuText}>Configurações</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#3a3688', // Um pouco mais claro que o fundo para destacar
    borderBottomWidth: 1,
    borderBottomColor: '#4D49FF',
  },
  logo: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItems: {
    flexDirection: 'row',
    gap: 20, // Espaço entre "Minha conta" e "Configurações"
  },
  menuText: {
    color: '#e0e0e0',
    fontSize: 16,
  },
});
