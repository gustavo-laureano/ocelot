import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import { API_URL } from '@/constants/env';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [photo, setPhoto] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleRegister = async () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Cadastro realizado com sucesso!');
        setIsError(false);
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(result.message || 'Ocorreu um erro.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center"
    >
      <View className="flex flex-col justify-center items-center w-[800px] gap-20 px-[30px] py-[37px] rounded-[10px] border border-white bg-main" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.15))' }}>
        <View className="flex flex-col justify-start items-start w-full gap-2.5">
          <Text className="w-[740px] text-7xl font-bold text-center text-white" style={{ fontFamily: 'DMSans_700Bold' }}>Cadastro</Text>
          <Text className="w-[740px] text-xl font-bold text-center uppercase text-white opacity-80" style={{ fontFamily: 'DMSans_400Regular' }}>crie uma nova conta :)</Text>
        </View>
        <View className="flex flex-col justify-center items-center w-full gap-5">
          <FormInput label="E-mail" value={email} onChangeText={setEmail} />
          <FormInput label="Nome de usuário" value={username} onChangeText={setUsername} />
          <FormInput label="Nome completo" value={name} onChangeText={setName} />
          <FormInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry/>
          <FormInput label="Telefone" value={phone} onChangeText={setPhone}/>
          <FormInput label="URL do GitHub" value={github} onChangeText={setGithub}/>
          <FormInput label="URL do LinkedIn" value={linkedin} onChangeText={setLinkedin} />

          <Pressable
            className="flex justify-center items-center gap-2.5 px-14 py-[7px] rounded-[10px] bg-white"
            onPress={handleRegister}
            disabled={isLoading}
            style={({ pressed }) => pressed ? { opacity: 0.8 } : {}}
          >
            {isLoading ? (
              <ActivityIndicator color="#001203" />
            ) : (
              <Text className="text-xl font-bold text-center uppercase text-main" style={{ fontFamily: 'DMSans_400Regular' }}>cadastrar</Text>
            )}
          </Pressable>
          {message ? (
            <Text className={`mt-2 text-center font-bold ${isError ? 'text-red-700' : 'text-green-600'}`}>
              {message}
            </Text>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

function FormInput({ label, ...props }: FormInputProps) {
  return (
    <View >
      <TextInput
        className="flex flex-col w-[740px] h-[80px] px-[26px] py-[10px] rounded-[10px] border border-white bg-main text-2xl text-white"
        style={{ fontFamily: 'DMSans_400Regular' }}
        placeholder={label}
        placeholderTextColor='rgba(255, 255, 255, 0.5)'
        {...props}
      />
    </View>
  );
}

