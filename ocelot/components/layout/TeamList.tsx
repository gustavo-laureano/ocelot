import { Card, Title } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { purpleDark } from "@/constants/theme";
import GroupIcon from '@/assets/images/group.svg'; 
import { API_URL } from "@/constants/env"; 

type Team = {
  id: number;
  name: string;
  description: string;
};

export default function TeamList() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function deleteTeam(team_id: number) {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este time?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Apagar",
          onPress: async () => {
            try {
              if (!token) {
                setError("Token de autenticação não encontrado. Por favor, faça login novamente.");
                return;
              }
              if (!team_id) {
                setError("ID do time não fornecido para exclusão.");
                return;
              }

              setLoading(true);

              const response = await fetch(
                `${API_URL}/team/delete?team_id=${team_id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Falha ao excluir time com ID ${team_id}`);
              }

              setTeams((prevTeams) => prevTeams.filter((team) => team.id !== team_id));
              Alert.alert("Sucesso", "Time excluído com sucesso!");
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
    const fetchTeams = async () => {
      try {
        if (!token || !userId) {
          setError("Token ou ID do usuário não encontrado. Por favor, faça login.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/team/list?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha ao buscar times.");
        }

        const data = await response.json();
        setTeams(data.teams || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
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

  if (teams.length === 0) {
    return (
      <View style={Card.cardContainer}>
        <Text style={Title.h1}>Nenhum time encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {teams.map((team) => (
        <TouchableOpacity key={team.id} onPress={() => console.log(`Team ${team.id} clicked`)}>
          <View style={styles.teamContainer}>
            <View style={styles.teamInfoContainer}>
              <GroupIcon width={50} height={50} style={styles.groupIcon} />
              <View style={styles.textContainer}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamDescription}>{team.description || ""}</Text>
              </View>
            </View>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity onPress={() => deleteTeam(team.id)}>
                <Image
                  source={{ uri: "https://img.icons8.com/material-outlined/24/trash--v1.png" }}
                  resizeMode={"stretch"}
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const white = "#FFFFFF";

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: white,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  teamInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    marginLeft: 20,
  },
  groupIcon: {
    alignItems: "center",
    margin: 20,
  },
  textContainer: {
    flexDirection: "column",
  },
  teamName: {
    color: purpleDark,
    fontSize: 28,
    fontWeight: "bold",
  },
  teamDescription: {
    color: purpleDark,
    fontSize: 18,
    marginLeft: 1,
  },
  deleteButtonContainer: {
    flex: 1,
    alignSelf: "flex-end",
  },
  deleteIcon: {
    width: 16,
    height: 17,
    marginTop: 3,
    marginRight: 31,
    alignSelf: "flex-end",
  },
});
