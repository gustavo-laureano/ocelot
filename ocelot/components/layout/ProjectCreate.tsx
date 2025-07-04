import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Pressable,
  Alert, 
  Platform,
  TextInput // Importado para usar no FormInput
} from 'react-native';

// Supondo que seu theme.ts exporte a cor
import {purpleDark} from '@/constants/theme'; 

// Bibliotecas nativas - INSTALE-AS!
// npx expo install expo-image-picker @react-native-community/datetimepicker
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { executeNativeBackPress } from 'react-native-screens';


// --- COMPONENTE REUTILIZÁVEL PARA INPUTS (pode ficar no mesmo arquivo ou ser importado) ---
const FormInput = ({ label, value, onChangeText, multiline = false, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
      multiline={multiline}
      {...props}
    />
  </View>
);


// --- COMPONENTE PRINCIPAL ---
const ProjectCreate: React.FC = () => {
  const [form, setForm] = useState({
    team_id: '',
    owner_id: '',
    name: '',
    description: '',
    start_date: new Date(), // Usar objetos Date para o seletor
    real_end_date: null as Date | null, // Iniciar como nulo
    status: ''
  });
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // State para o DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState<'start_date' | 'real_end_date'>('start_date');

  // Lógica NATIVA para atualizar o formulário
  const handleChange = (name: keyof typeof form, value: any) => {
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  // Lógica NATIVA para selecionar imagem
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
      base64: true, // Solicita a conversão para base64
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 || null);
    }
  };
  
  // Funções NATIVAS para o seletor de data
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // No iOS, o picker pode ficar aberto
    if (selectedDate) {
      handleChange(datePickerField, selectedDate);
    }
  };

  const showDatepickerFor = (fieldName: 'start_date' | 'real_end_date') => {
    setDatePickerField(fieldName);
    setShowDatePicker(true);
  };
  
  // Lógica NATIVA para o submit
  const handleSubmit = async () => {
    if (!form.name || !form.description || !photoBase64) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o nome, descrição e selecione uma imagem.');
      return;
    }

    setLoading(true);
    setMessage('');

    // **IMPORTANTE**: Use o IP da sua máquina, não 'localhost'
    const API_URL = 'http://localhost:3000/project/create'; // <-- TROQUE PELO SEU IP

    const body = {
      ...form,
      photo: photoBase64, // Adiciona a foto em base64 ao corpo da requisição
      // Converte as datas para string no formato ISO, que é o padrão ideal para APIs
      start_date: form.start_date.toISOString(),
      real_end_date: form.real_end_date ? form.real_end_date.toISOString() : null,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage('Projeto criado com sucesso!');
        Alert.alert('Sucesso!', 'Projeto criado com sucesso!');
        // Aqui você pode resetar o formulário ou navegar para outra tela
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Criar Projeto</Text>
        <FormInput
          label="Nome do Projeto"
          placeholder="Ex: App de Gestão Financeira"
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

        {/* Seletor de Imagem Nativo */}
        <Text style={styles.label}>Imagem do Projeto</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={handlePhotoChange}>
            <Text style={styles.buttonTextBlue}>
              {photoUri ? 'Alterar Imagem' : 'Escolher uma Imagem'}
            </Text>
        </TouchableOpacity>
        <Text style={styles.fileName}>Imagem selecionada!</Text>


        {/* <Text style={styles.label}>Data de Início</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => showDatepickerFor('start_date')}>
          <Text>{form.start_date.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Data de Conclusão (Opcional)</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => showDatepickerFor('real_end_date')}>
          <Text>
            {form.real_end_date ? form.real_end_date.toLocaleDateString('pt-BR') : 'Selecione uma data'}
          </Text>
        </TouchableOpacity>
        
          <DateTimePicker
            value={form[datePickerField] || new Date()} // Garante um valor válido
            mode="date"
            display="default"
            onChange={onDateChange}
          /> */}

<FormInput
          label="Data de inicio"
          type="date"
          placeholder="xx/xx/xxxx"
          value={form.start_date}
          onChangeText={(text: any) => handleChange('start_date', text)}
        />

<FormInput
          label="Data de conclusão (Opcional)"
          type="date"
          placeholder="xx/xx/xxxx"
          value={form.real_end_date}
          onChangeText={(text: any) => handleChange('real_end_date', text)}
        />
        
        {/* Botão de Submit */}
        <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar Projeto'}</Text>
        </TouchableOpacity>


            <Text style={loading ? styles.successMessage : styles.errorMessage}>
              {message}
            </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',},
  formContainer: {
    minWidth: '70%',
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#e7f3ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  buttonTextBlue: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileName: {
    textAlign: 'center',
    marginTop: 8,
    color: 'green',
    fontSize: 14,
  },
  datePickerButton: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: purpleDark, // Usando a cor do seu tema
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
    color: 'blue',
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

export default ProjectCreate;