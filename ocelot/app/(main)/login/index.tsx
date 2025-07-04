import { View, Text, ScrollView } from 'react-native';
import { Title, Card, ScrollViewer } from '@/constants/theme';
import LoginForm from '@/components/layout/LoginForm';
import RegisterForm from '@/components/layout/RegisterForm';

export default function Login() {
  return (
    <ScrollView style={ScrollViewer.container}>
      <LoginForm/>
      <RegisterForm/>
    </ScrollView> 
  );
}