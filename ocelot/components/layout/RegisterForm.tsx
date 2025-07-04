import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator, Platform} from 'react-native';
import { Title, Card, purpleDark } from '@/constants/theme';
import { useState } from 'react';

// A URL do seu backend. Mude se for diferente.
const API_URL = 'http://localhost:3000/auth/register'; 
// Se estiver testando em um celular Android, use o IP da sua máquina no lugar de localhost. Ex: 'http://192.168.1.10:3000/auth/register'

export default function RegisterForm() {
  // --- STATE MANAGEMENT ---
  // Para cada campo do formulário, criamos um "estado" para armazenar seu valor.
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photo, setPhoto] = useState('');

  // Estados para controlar o feedback ao usuário
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // --- FUNÇÃO DE SUBMISSÃO ---
  const handleRegister = async () => {
    // Validação básica
    if (!username || !name || !email || !password) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      setIsError(true);
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    const userData = {
      username,
      name,
      email,
      password,
      phone: phone || null,
      github: github || null,
      linkedin: linkedin || null,
      photo: photo || null,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Cadastro realizado com sucesso!');
        setIsError(false);
        // Limpar o formulário (opcional)
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
        // ... limpar outros campos
      } else {
        setMessage(result.message || 'Ocorreu um erro.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
      setIsError(true);
    } finally {
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
          <Text style={Title.h1}>Cadastro</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome de Usuário *"
            value={username}
            onChangeText={setUsername} // Atualiza o estado 'username' a cada letra digitada
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Nome Completo *"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" // Melhora a experiência do usuário mostrando o teclado de email
            autoCapitalize="none"
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
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="URL do GitHub"
            value={github}
            onChangeText={setGithub}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="URL do LinkedIn"
            value={linkedin}
            onChangeText={setLinkedin}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />

          {/* Botão de Cadastro */}
          <Pressable 
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isLoading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" /> // Mostra um spinner durante o carregamento
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
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