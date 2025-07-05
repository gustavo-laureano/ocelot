import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from "react-native";
// Removi dependências não utilizadas neste exemplo para simplificar
// import { encode as base64encode } from "base-64";
import { API_URL } from "@/constants/env";
import { encode as base64encode } from "base-64";

type Project = {
id: number;
name: string;
description: string;
photo?: { type: string; data: number[] } | string | null;
team_members?: string;

}; 

const defaultIcon = require("@/assets/images/react-logo.png");

const getBase64ImageUri = (
  photoData: { type: string; data: number[] } | string | null | undefined,
): string | null => {
  if (!photoData) {
    return null;
  }
  if (typeof photoData === "string") {
    return photoData;
  }
  if (photoData.type === "Buffer" && Array.isArray(photoData.data)) {
    try {
      const dataBytes = photoData.data;
      let mimeType = "application/octet-stream";
      if (
        dataBytes[0] === 0xff &&
        dataBytes[1] === 0xd8 &&
        dataBytes[2] === 0xff
      ) {
        mimeType = "image/jpeg";
      } else if (
        dataBytes[0] === 0x89 &&
        dataBytes[1] === 0x50 &&
        dataBytes[2] === 0x4e &&
        dataBytes[3] === 0x47
      ) {
        mimeType = "image/png";
      } else if (
        dataBytes[0] === 0x47 &&
        dataBytes[1] === 0x49 &&
        dataBytes[2] === 0x46 &&
        dataBytes[3] === 0x38
      ) {
        mimeType = "image/gif";
      }
      const binaryString = String.fromCharCode(...dataBytes);
      const base64 = base64encode(binaryString);
      return `data:${mimeType};base64,${base64}`;
    } catch (e) {
      console.error("Error converting buffer to Base64 or inferring type:", e);
      return null;
    }
  }
  return null;
};



export default function ProjectCarousel() {
  const router = useRouter();
  // Usamos a largura da tela para o container do FlatList, mas o card interno terá um tamanho fixo.
  const { width: screenWidth } = useWindowDimensions();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList<Project>>(null);

  // Efeito para buscar os dados (usando mock)
useEffect(() => {

const fetchProjects = async () => {

setLoading(true);

try {

const token = localStorage.getItem("token");

const userId = localStorage.getItem("userId");

const response = await fetch(`${API_URL}/project/list?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } });

if (!response.ok) throw new Error("Falha ao buscar projetos.");

const data = await response.json();

setProjects(data.projects || []);

await new Promise(resolve => setTimeout(resolve, 1000)); // Simula latência de rede


} catch (err: any) {

setError(err.message);

} finally {

setLoading(false);

}

};

fetchProjects();

}, []); 
  
  // Hook para atualizar o activeIndex com base no que está visível na tela
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;


  // --- RENDERIZAÇÃO --- //

  // A função que renderiza cada item do carrossel foi totalmente refeita
  const renderProjectItem = ({ item }: { item: Project }) => (
    
    <View style={styles.cardContainer}>

      
        {/* Coluna da Esquerda: Imagem */}
        <View style={styles.leftColumn}>
            <Image
              source={
                getBase64ImageUri(item.photo)
                  ? { uri: getBase64ImageUri(item.photo)! }
                  : defaultIcon
              }
              resizeMode="cover"
              style={styles.projectImage}
              onError={(e) => {
                console.warn(
                  "Failed to load project image, displaying default.",
                  e.nativeEvent.error,
                );
              }}
            />
            <View style={styles.textOverlay}>
                <Text style={styles.projectName}>{item.name}</Text>
            </View>
        </View>

        {/* Coluna da Direita: Informações */}
        <View style={styles.rightColumn}>
            <View style={styles.placeholderBox} />
            
            {/* Barra de Progresso */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressFilled} />
                <View style={styles.progressUnfilled} />
            </View>
            
            {/* Botão "Ver mais" */}
            <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => router.push(`/projetos/${item.id}`)}
            >
                <Text style={styles.detailsButtonText}>Ver mais</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  // --- COMPONENTE PRINCIPAL --- //

  if (loading) return <ActivityIndicator size="large" color="#2c205a" style={{ marginVertical: 50 }}/>;
  if (error) return <Text style={styles.errorText}>Erro: {error}</Text>;
  if (projects.length === 0) return <Text style={styles.infoText}>Nenhum projeto encontrado.</Text>;

  // A largura do item é a largura da tela para garantir o efeito de paginação
  const ITEM_WIDTH = screenWidth;

  return (
    // Container geral que inclui o carrossel e a paginação
    <View style={styles.carouselWrapper}>
      <FlatList
        ref={flatListRef}
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled // Essencial para o efeito de "parar" em cada item
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // O item é considerado "visível" quando 50% dele está na tela
        }}
        snapToAlignment="center"
        decelerationRate="fast"
        // Garante que cada item ocupe a largura correta
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />

      {/* Paginação (pontos) */}
      <View style={styles.paginationContainer}>
        {projects.map((_, idx) => (
           <View
              key={idx}
              style={[
                styles.paginationDot,
                // Estilo condicional para o ponto ativo
                idx === activeIndex
                  ? styles.paginationDotActive
                  : styles.paginationDotInactive,
              ]}
            />
        ))}
      </View>
    </View>
  );
}

// --- ESTILOS (Totalmente refeitos para corresponder ao design) ---
const styles = StyleSheet.create({
  errorText: { color: 'red', textAlign: 'center', margin: 20 },
  infoText: { color: 'gray', textAlign: 'center', margin: 20 },

  // Wrapper que segura o FlatList e a Paginação
  carouselWrapper: {
      alignItems: 'center',
      paddingVertical: 20, // Espaço para a sombra e paginação
      // A cor de fundo da sua tela deve ser o roxo escuro
      // backgroundColor: '#2c205a', 
  },
  
  // O container branco principal para cada item do carrossel
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    height: 200, // Altura fixa para o card
    // Use uma margem horizontal para que os cards não fiquem colados nas bordas da tela
    // O padding no wrapper da FlatList controla o espaçamento entre os cards
    marginHorizontal: 30, 
    minWidth: 300, // Largura mínima para o card
    alignSelf: 'center', // Centraliza o card no espaço do item da FlatList
    
    // Sombra para dar profundidade (opcional, mas melhora o visual)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  
  // --- Coluna da Esquerda (Imagem) ---
  leftColumn: {
      flex: 1, // Ocupa metade do espaço
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      overflow: 'hidden', // Garante que a imagem respeite o raio da borda
      position: 'relative', // Para o overlay de texto
  },
  projectImage: {
      width: '100%',
      height: '100%',
  },
  textOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
      // Fundo em gradiente para melhor legibilidade (simplificado aqui com cor sólida)
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  projectName: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
  },
  
  // --- Coluna da Direita (Infos) ---
  rightColumn: {
      flex: 1, // Ocupa a outra metade
      padding: 16,
      justifyContent: 'space-between', // Distribui os itens verticalmente
      alignItems: 'center',
  },
  placeholderBox: {
      width: '100%',
      height: 80, // Altura do box cinza
      backgroundColor: '#f0f2f5', // Um cinza claro
      borderRadius: 8,
  },
  progressBarContainer: {
      width: '100%',
      height: 10,
      backgroundColor: '#e0e0e0', // Fundo da barra
      borderRadius: 5,
      flexDirection: 'row',
      overflow: 'hidden',
      marginTop: 10,
  },
  progressFilled: {
      width: '70%', // Exemplo de progresso
      backgroundColor: '#4a3f7a', // Roxo escuro
  },
  progressUnfilled: {
      // O restante da barra
      flex: 1, 
      backgroundColor: '#8c7df0', // Roxo claro
  },
  detailsButton: {
      backgroundColor: '#f0f2f5', // Cinza claro, igual ao placeholder
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginTop: 10,
  },
  detailsButtonText: {
      color: '#4a3f7a', // Roxo escuro
      fontWeight: '600',
      fontSize: 14,
  },

  // --- Paginação (Pontos) ---
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Espaço entre o card e os pontos
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  paginationDotActive: {
      backgroundColor: '#4a3f7a', // Cor do ponto ativo
  },
  paginationDotInactive: {
      backgroundColor: '#d8d8d8', // Cor do ponto inativo
  },
});