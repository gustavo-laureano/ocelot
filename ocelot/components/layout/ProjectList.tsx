import { Card, Title } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { encode as base64encode } from "base-64";

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
  team_members?: string;
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
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Apagar",
          onPress: async () => {
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
          },
        },
      ],
      { cancelable: true }
    );
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
        <TouchableOpacity key={project.id}   onPress={() => router.push(`/projetos/${project.id}`)}  style={{ flex: 1, marginBottom: 15 }}
>
					<View 
						style={{
							flex: 1,
							flexDirection: "row",
							alignItems: "flex-start",
							backgroundColor: "#FFFFFF",
							borderRadius: 10,
							paddingVertical: 10,
              marginBottom: 15,
              marginLeft: 30,
              marginHorizontal: 15,
              width: "70%",
						}}>
						<Image
							source={
                    getBase64ImageUri(project.photo)
                      ? { uri: getBase64ImageUri(project.photo)! }
                      : defaultIcon
                  }
              resizeMode = {"cover"}
							style={{
								width: 187,
								height: 118,
								marginLeft: 16,
								marginRight: 27,
							}}
              onError={(e) => {
                    // Em caso de erro ao carregar a imagem, exibe o ícone padrão
                    console.warn(
                      "Failed to load project image, displaying default.",
                      e.nativeEvent.error,
                    );}}
						/>
						<View 
							style={{
								alignItems: "flex-start",
								marginVertical: 8,
                width: "70%",
                
							}}>
							<View 
								style={{
									marginBottom: 27,
                  
								}}>
								<Text 
									style={{
										color: "#2F1893",
										fontSize: 32,
										fontWeight: "bold",
									}}>
									{project.name}
								</Text>
								<Text 
									style={{
										color: "#2F1893",
										fontSize: 20,
										fontWeight: "bold",
										marginLeft: 1,
									}}>
									{project.description || ""}
								</Text>
							</View>
							<View 
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginLeft: 1,
								}}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/wqg7klat_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 16,
										height: 16,
										marginRight: 4,
									}}
								/>
                <Text 
									style={{
										color: "#2F1893",
										fontSize: 12,
										fontWeight: "bold",
									}}>
									{project.team_members || ""}
								</Text>
							</View>
						</View>
						<View 
							style={{
								flex: 1,
                alignSelf: "flex-end",
							}}>
						
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/t5kri2l7_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 16,
								height: 17,
								marginTop: 3,
								marginRight: 31,
                alignSelf: "flex-end",
							}}
						/>
            <TouchableOpacity onPress={() => deleteProject(project.id)}>
              <Image
                source = {{uri: "https://img.icons8.com/material-outlined/24/trash--v1.png"}} 
                resizeMode = {"stretch"}
                style={{
                  width: 16,
                  height: 17,
                  marginTop: 3,
                  marginRight: 31,
                  alignSelf: "flex-end",
                }}
              />
            </TouchableOpacity>            
            </View>
            </View></TouchableOpacity>
      ))}
      </ScrollView>
  );
};


