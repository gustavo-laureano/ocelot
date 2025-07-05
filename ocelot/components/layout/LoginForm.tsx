import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, ActivityIndicator, Platform} from 'react-native';
import { Title, Card, purpleDark } from '@/constants/theme';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL} from '@/constants/env';


export default function LoginForm() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  // Estados para controlar o feedback ao usuário
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // --- FUNÇÃO DE SUBMISSÃO ---
  const handleLogin= async () => {
    // Validação básica
    if (!username || !password) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      setIsError(true);
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    const userData = {
      username,
      password
    };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Login realizado com sucesso!');
        setIsError(false);
        await AsyncStorage.setItem('authorization', result.token);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user.id);

      } else {
        setMessage(result.message || 'Ocorreu um erro.');
        setIsError(true);
      }
    }catch (error) {
      console.error('Fetch Error:', error);
      setMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
      setIsError(true);
    }finally {
      setIsLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView ajuda a não esconder os inputs atrás do teclado
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
        {/* Usando o seu estilo de Card, se aplicável, ou o estilo local */}
        <View style={[Card.cardContainer, styles.formContainer]}>
          <Text style={Title.h1}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome de Usuário *"
            value={username}
            onChangeText={setUsername} // Atualiza o estado 'username' a cada letra digitada
            placeholderTextColor="#888"
          />
           <TextInput
            style={styles.input}
            placeholder="Senha *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Esconde o texto da senha
            placeholderTextColor="#888"
          />

          {/* Botão de Login */}
          <Pressable 
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" /> // Mostra um spinner durante o carregamento
            ) : (
              <Text style={styles.buttonText}>Fazer Login</Text>
            )}
          </Pressable>

          {/* Mensagem de Feedback */}
          {message ? (
            <Text style={isError ? styles.errorMessage : styles.successMessage}>
              {message}
            </Text>
          ) : null}

        </View>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS ---
// Usamos StyleSheet.create para otimizações e validações
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    // Estilos do seu Card.cardContainer serão aplicados.
    // Adicione ou substitua estilos aqui se necessário.
    padding: 20,
    backgroundColor: '#fff', // Exemplo
    borderRadius: 10,       // Exemplo
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    backgroundColor: purpleDark,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});