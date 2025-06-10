
import { StyleSheet } from 'react-native';

const tintColorLight = '#dec2ff';
const purpleDark = '#2D2A6C';
const midDarkPurple = '#3b358c';
const purpleLight = '#4a45a0';

export const styleSidebar = StyleSheet.create({
  sidebarContainer: {
    width: 250,
    padding: 20,
    paddingLeft: 50,

  },
  title: {
    color: tintColorLight,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
  },
  navGroup: {
    gap: 5,

  },
  navItem: {
    textAlign: 'left',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 2,

  },
  navItemActive: {
    backgroundColor: purpleLight,
    borderColor: midDarkPurple,
  },
  navText: {
    color: tintColorLight,
    fontSize: 18,
    fontWeight: '400',
  },
});

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