import { StyleSheet } from 'react-native';

export const COLORS = {
  main: '#254728',
  white: '#FFFFFF',
  background: '#254728',
  text: '#001203',
  border: '#011605ff',
  card: '#ffffff5e',
  accent: '#001203',
  error: '#770000ff',
  success: '#00cc22ff',
  warning: '#ff7a0dff',
  info: '#001203',
};

export const Title = StyleSheet.create({
  h1: {
    fontSize: 32,
    color: COLORS.white,
  },
});

  export const Card = StyleSheet.create({
  cardContainer: {

  }});

  export const ScrollViewer = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },});


export const TextStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    color: COLORS.white,
    fontFamily: 'DMSans_900Black',
  },
});
