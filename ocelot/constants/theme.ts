
import { StyleSheet } from 'react-native';

export const tintColorLight = '#dec2ff';
export const purpleDark = '#2D2A6C';
export const midDarkPurple = '#3b358c';
export const purpleLight = '#4a45a0';


export const Title = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: purpleDark,
    marginBottom: 10,
  }});

  export const Card = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  }});

  export const ScrollViewer = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },});