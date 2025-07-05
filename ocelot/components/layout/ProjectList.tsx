import { Card, Title } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { encode as base64encode } from "base-64";
import { API_URL } from '@/constants/env';

const defaultIcon = require("@/assets/images/icon.png");
const router = useRouter();

type Project = {
  id: number;
  team_id: number;
  owner_id: number;
  name: string;
  description: string;
  photo?: { type: string; data: number[] } | string | null;
  start_date: string;
  real_end_date?: string | null;
  status: string;
  created: string;
  updated: string;
  team_members?: string;
};

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

export default function ProjectList() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function deleteProject(project_id: number) {
            try {
              if (!token) {
                setError(
                  "Token de autenticação não encontrado. Por favor, faça login novamente.",
                );
                return;
              }
              if (!project_id) {
                setError("ID do projeto não fornecido para exclusão.");
                return;
              }
              setLoading(true);
              const response = await fetch(
                `${API_URL}/project/delete?project_id=${project_id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.message || `Falha ao excluir projeto com ID ${project_id}`,
                );
              }
              setProjects((prevProjects) =>
                prevProjects.filter((proj) => proj.id !== project_id)
              );
              Alert.alert("Sucesso", "Projeto excluído com sucesso!");
            } catch (err: any) {
              setError(err.message);
              Alert.alert("Erro", err.message);
            } finally {
              setLoading(false);
            }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!token || !userId) {
          setError(
            "Token ou ID do usuário não encontrado. Por favor, faça login.",
          );
          setLoading(false);
          return;
        }
        const response = await fetch(
          `${API_URL}/project/list?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha ao buscar projetos.");
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token, userId]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={Card.cardContainer}>
        <Text style={Title.h1}>Erro: {error}</Text>
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View style={Card.cardContainer}>
        <Text style={Title.h1}>Nenhum projeto encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {projects.map((project) => (
        <TouchableOpacity
          key={project.id}
          onPress={() => router.push(`/projetos/${project.id}`)}
          style={styles.touchable}
        >
          <View style={styles.projectContainer}>
            <Image
              source={
                getBase64ImageUri(project.photo)
                  ? { uri: getBase64ImageUri(project.photo)! }
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
            <View style={styles.projectInfo}>
              <View style={styles.projectTextContainer}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDescription}>
                  {project.description || ""}
                </Text>
              </View>
              <View style={styles.teamRow}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/wqg7klat_expires_30_days.png",
                  }}
                  resizeMode="stretch"
                  style={styles.teamIcon}
                />
                <Text style={styles.teamMembers}>
                  {project.team_members || ""}
                </Text>
              </View>
            </View>
            <View style={styles.actionsContainer}>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/t5kri2l7_expires_30_days.png",
                }}
                resizeMode="stretch"
                style={styles.actionIcon}
              />
              <TouchableOpacity onPress={() => deleteProject(project.id)}>
                <Image
                  source={{
                    uri: "https://img.icons8.com/material-outlined/24/trash--v1.png",
                  }}
                  resizeMode="stretch"
                  style={styles.trashIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    marginBottom: 10,

  },
  projectContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 20,
    shadowOpacity: 0.15,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 30,
    marginHorizontal: 15,
    width: "70%",
  },
  projectImage: {
    alignSelf: "center",
    width: 187,
    height: 118,
    marginLeft: 16,
    marginRight: 27,
    borderRadius: 10,
  },
  projectInfo: {
    alignItems: "flex-start",
    marginVertical: 8,
    width: "70%",
  },
  projectTextContainer: {
    marginBottom: 27,
  },
  projectName: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  projectDescription: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 1,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 1,
  },
  teamIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  teamMembers: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionsContainer: {
    flex: 1,
    alignSelf: "flex-end",
  },
  actionIcon: {
    width: 16,
    height: 17,
    marginTop: 3,
    marginRight: 31,
    alignSelf: "flex-end",
  },
  trashIcon: {
    width: 16,
    height: 17,
    marginTop: 3,
    marginRight: 31,
    alignSelf: "flex-end",
  },
});
