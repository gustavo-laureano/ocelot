import { View, Text, ScrollView } from 'react-native';
import { Title, Card, ScrollViewer } from '@/constants/Colors';

export default function Home() {
  return (
    <ScrollView style={ScrollViewer.container}>
    <View style={Card.cardContainer}> 
    <Text style={Title.h1}> Relatórios </Text>
    </View></ScrollView>
  );
}