import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Title, Card } from '@/constants/Colors';

export default function CardHours() {
  return (
    <View style={Card.cardContainer}> 
    <Text style={Title.h1}> Card de Horas </Text>
    </View>
  );
}