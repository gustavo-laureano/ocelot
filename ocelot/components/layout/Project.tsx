import { Card, Title } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { encode as base64encode } from "base-64";
import { Button } from "@react-navigation/elements";
import { router, useRouter } from "expo-router";

// Assuming you have a default icon at this path
// Make sure this path is correct for your project
const defaultIcon = require("@/assets/images/icon.png");
const router = useRouter();
type Project = {
  id: number;
  team_id: number;
  owner_id: number;
  name: string;
  description: string;
  photo?: { type: string; data: number[] } | string | null; // Updated photo type to include Buffer structure
  start_date: string;
  real_end_date?: string | null;
  status: string;
  created: string;
  updated: string;
};

// Helper function to convert buffer data to a Base64 string for image display
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
      let mimeType = "application/octet-stream"; // Default unknown type

      // Check for common image magic numbers
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
      // Add more checks for other formats like BMP, TIFF, WebP if needed

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
  const userId = localStorage.getItem("userId"); // Ensure userId is correctly retrieved

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
        `http://localhost:3000/project/delete?project_id=${project_id}`,
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

      // Update the projects list after successful deletion
      setProjects((prev) => prev.filter((p) => p.id !== project_id));
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
          `http://localhost:3000/project/list?userId=${userId}`,
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
        // Assuming data.projects is an array of Project objects
        setProjects(data.projects || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, userId]); // Depend on token and userId to re-fetch if they change

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noProjectsText}>Nenhum projeto encontrado.</Text>
      </View>
    );
  }

  return (

    <View>
      <Text >Meus Projetos</Text>

      {projects.map((project) => (
        <TouchableOpacity key={project.id} style={styles.projectItem}>
          <Pressable
            style={styles.deleteButton}
            onPress={() => deleteProject(project.id)}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </Pressable>

          <Image
            source={
              getBase64ImageUri(project.photo)
                ? { uri: getBase64ImageUri(project.photo)! } // Use ! to assert non-null after check
                : defaultIcon
            }
            style={styles.projectImage}
            resizeMode="cover"
            onError={(e) => {
              console.warn(
                "Failed to load project image, displaying default.",
                e.nativeEvent.error,
              );
              // You could set a state here to replace only this specific image with default
              // For simplicity, it falls back to the defaultIcon if getBase64ImageUri returns null
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
            <Text style={styles.projectStatus}>Status: {project.status}</Text>
            <Text style={styles.projectDates}>
              Início: {project.start_date}
            </Text>
            {project.real_end_date && (
              <Text style={styles.projectDates}>
                Fim: {project.real_end_date}
              </Text>
            )}
          </View>
        </TouchableOpacity>

      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#333", // Darker background for the list
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
    textAlign: "center",
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  projectImage: {
    width: 100, // Reduced width for better layout in a list item
    height: 100, // Reduced height
    borderRadius: 8, // Slightly less rounded than original example
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3498DB",
    textDecorationLine: "underline",
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  projectStatus: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
  },
  projectDates: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
    alignSelf: "center", // Align button vertically in the center
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noProjectsText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
  },
});
