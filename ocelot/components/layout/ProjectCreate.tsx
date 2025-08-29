import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput
} from 'react-native';

import { API_URL } from '@/constants/env';
import * as ImagePicker from 'expo-image-picker';
import "../../styles/global.css";

const FormInput = ({ label, value, onChangeText, multiline = false, ...props }) => (
  <View>
    <Text>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      {...props}
    />
  </View>
);

const ProjectCreate: React.FC = () => {
  const [form, setForm] = useState({
    team_id: '',
    owner_id: '',
    name: '',
    description: '',
    start_date: new Date(),
    real_end_date: null as Date | null,
    status: ''
  });

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (name: keyof typeof form, value: any) => {
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handlePhotoChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description ) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o nome, descrição');
      return;
    }

    setLoading(true);
    setMessage('');

    const body = {
      ...form,
      start_date: form.start_date.toISOString(),
      real_end_date: form.real_end_date ? form.real_end_date.toISOString() : null,
    };

    try {
      const response = await fetch(`${API_URL}/project/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage('Projeto criado com sucesso!');
        Alert.alert('Sucesso!', 'Projeto criado com sucesso!');
      } else {
        Alert.alert('Sucesso', data.message || 'Erro ao criar projeto.');
        Alert.alert('Erro', data.message || 'Ocorreu um erro ao criar o projeto.');
      }
    } catch (err) {
      setMessage('Erro de conexão. Verifique o IP do servidor e sua conexão.');
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className='flex justify-center items-center flex-grow'>
      <View className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0c w-[1200px] gap-20 px-[30px] py-[37px] rounded-[10px] border border-white">
        <Text className="self-stretch flex-grow-0 flex-shrink-0 text-7xl font-bold text-center text-white"> Criar Projeto</Text>
        <FormInput
          label="Nome do Projeto"
          placeholder="Ex: App de Gestão Financeira"
          className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[57px] relative w-[600px] gap-2.5 px-[26px] py-[17px] rounded-[10px] border border-white"
          value={form.name}
          onChangeText={(text: any) => handleChange('name', text)}
        />
        <FormInput
          label="Descrição"
          placeholder="Descreva o objetivo principal do projeto"
          value={form.description}
          onChangeText={(text: any) => handleChange('description', text)}
          multiline
        />
        <FormInput
          label="Team ID"
          placeholder="ID da equipe responsável"
          value={form.team_id}
          onChangeText={(text: any) => handleChange('team_id', text)}
          keyboardType="numeric"
        />
        <FormInput
          label="Owner ID"
          placeholder="ID do dono do projeto"
          value={form.owner_id}
          onChangeText={(text: any) => handleChange('owner_id', text)}
          keyboardType="numeric"
        />
        <FormInput
          label="Status"
          placeholder="Ex: Em andamento"
          value={form.status}
          onChangeText={(text: any) => handleChange('status', text)}
        />

        <Text>Imagem do Projeto</Text>
        <TouchableOpacity onPress={handlePhotoChange}>
            <Text>
              {photoUri ? 'Alterar Imagem' : 'Escolher uma Imagem'}
            </Text>
        </TouchableOpacity>
        <Text>Imagem selecionada!</Text>

        <FormInput
          label="Data de inicio"
          placeholder="xx/xx/xxxx"
          value={form.start_date}
          onChangeText={(text: any) => handleChange('start_date', text)}
        />

        <FormInput
          label="Data de conclusão (Opcional)"
          placeholder="xx/xx/xxxx"
          value={form.real_end_date}
          onChangeText={(text: any) => handleChange('real_end_date', text)}
        />
        
        <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={loading}>
            <Text>{loading ? 'Criando...' : 'Criar Projeto'}</Text>
        </TouchableOpacity>

        <Text>
          {message}
        </Text>
      </View>
    </ScrollView>
  );
}

export default ProjectCreate;
