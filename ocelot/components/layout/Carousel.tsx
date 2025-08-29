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
import { COLORS } from "@/constants/theme";
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
  const { width: screenWidth } = useWindowDimensions();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList<Project>>(null);

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
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

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

  if (loading) return <ActivityIndicator size="large" color={COLORS.main} style={{ marginVertical: 50 }}/>;
  if (error) return <Text style={styles.errorText}>Erro: {error}</Text>;
  if (projects.length === 0) return <Text style={styles.infoText}>Nenhum projeto encontrado.</Text>;

  const ITEM_WIDTH = screenWidth;

  return (
    <View style={styles.carouselWrapper}>
      <FlatList
        ref={flatListRef}
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        snapToAlignment="center"
        decelerationRate="fast"
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

const styles = StyleSheet.create({
  errorText: { color: COLORS.error, textAlign: 'center', margin: 20 },
  infoText: { color: COLORS.text, textAlign: 'center', margin: 20 },

  carouselWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },

  cardContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    height: 200,
    marginHorizontal: 30,
    minWidth: 300,
    alignSelf: 'center',
    shadowColor: COLORS.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },

  leftColumn: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    position: 'relative',
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
    backgroundColor: 'rgba(0, 18, 3, 0.7)', // mainColor com transparência
  },
  projectName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  rightColumn: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholderBox: {
    width: '100%',
    height: 80,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFilled: {
    width: '70%',
    backgroundColor: COLORS.main,
  },
  progressUnfilled: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  detailsButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: COLORS.main,
  },
  paginationDotInactive: {
    backgroundColor: COLORS.card,
  },
});