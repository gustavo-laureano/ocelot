import { useRouter, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, SafeAreaView, Pressable, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { GlobalText, FONT_FAMILY, purpleDark, Card } from "../../../constants/theme";
import React, { useState, useEffect } from "react";
import TaskList from "@/components/layout/TaskList";
import { encode as base64encode } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@/constants/env';

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

export default function PaginaDoProjeto() {
	const router = useRouter();
	const { id: project_id } = useLocalSearchParams();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const fetchAuth = async () => {
			const t = await AsyncStorage.getItem("token");
			const u = await AsyncStorage.getItem("userId");
			setToken(t);
			setUserId(u);
		};
		fetchAuth();
	}, []);

	useEffect(() => {
		const fetchProjects = async () => {
			if (!token || !userId) {
				setError("Token ou ID do usuário não encontrado. Por favor, faça login.");
				setLoading(false);
				return;
			}
			try {
				const response = await fetch(
					`${API_URL}/project/list?project_id=${project_id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
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
		if (token && userId) fetchProjects();
	}, [token, userId, project_id]);

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
								setError("Token de autenticação não encontrado. Por favor, faça login novamente.");
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
								}
							);
							if (!response.ok) {
								const errorData = await response.json();
								throw new Error(errorData.message || `Falha ao excluir projeto com ID ${project_id}`);
							}
							setProjects((prevProjects) => prevProjects.filter((proj) => proj.id !== project_id));
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

	if (loading) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<Pressable onPress={() => router.navigate('projetos')} style={{ 
				backgroundColor: "white",    
				padding: 5, 
				borderRadius: 5, 
				marginRight: 15,
				marginBottom: 15,
				alignSelf: "flex-end",   }}>
				<Text style={{}}>Voltar</Text></Pressable>
	
			{projects.map((project) => (
				<ScrollView style={styles.scrollView} key={project.id}>
					<View style={styles.headerContainer}>
						<Image
							source={{
								uri: typeof project.photo === "string" ? project.photo : `data:${project.photo?.type};base64,${base64encode(String.fromCharCode(...project.photo?.data || []))}`,
							}}
							resizeMode={"cover"}
							style={styles.headerImage}
						/>
						<View style={styles.headerTextContainer}>
							<Text style={styles.headerTitle}>{project.name}</Text>
							<Text style={styles.headerSubtitle}>{project.description}</Text>
						</View>
					</View>
					<View style={styles.tabsContainer}>
						<TouchableOpacity style={styles.tabButton} onPress={() => alert("guenta que ainda nao funciona!")}>
							<Text style={styles.tabButtonText}>{"Lista"}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.tabButton} onPress={() => alert("guenta que ainda nao funciona!")}>
							<Text style={styles.tabButtonText}>{"Kanban"}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.tabButton} onPress={() => alert("guenta que ainda nao funciona!")}>
							<Text style={styles.tabButtonText}>{"Calendário"}</Text>
						</TouchableOpacity>
					</View>
															
						<TaskList/>
					
				</ScrollView>
			))}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	// ... (seu styles permanece igual)
	safeArea: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
		marginLeft: 19,
		marginTop: 19,
	},
	headerContainer: {
		flexDirection: "column",
		alignItems: "flex-start",
		paddingVertical: 6,
		paddingRight: 2,
		marginBottom: 15,
	},
	headerImage: {
		width: 203,
		height: 128,
		marginRight: 19,
		borderRadius: 10,
			},
	headerTextContainer: {
		marginTop: 7,
	},
	headerTitle: {
		color: "#FFFFFF",
		fontSize: 58,
		fontWeight: "bold",
	},
	headerSubtitle: {
		color: "#EAEAED",
		fontSize: 32,
		fontWeight: "bold",
		maxWidth: "70%",
	},
	tabsContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 7,
	},
	tabButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		paddingVertical: 3,
		paddingHorizontal: 31,
		marginRight: 6,
	},
	tabButtonText: {
		color: "#1E0D62",
		fontSize: 20,
		fontWeight: "bold",
	},
	cardContainer: {
		alignItems: "flex-start",
		backgroundColor: "#00000000",
		borderRadius: 10,
		paddingVertical: 13,
		paddingHorizontal: 32,
		marginBottom: 18,
	},
	cardTitleRow: {
		flexDirection: "row",
		marginBottom: 14,
		marginLeft: 1,
	},
	cardId: {
		color: "#FFFFFF",
		fontSize: 25,
		fontWeight: "bold",
		marginRight: 13,
	},
	cardTitle: {
		color: "#FFFFFF",
		fontSize: 25,
		fontWeight: "bold",
	},
	cardInfoRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	cardUserIcon: {
		width: 20,
		height: 20,
		marginRight: 8,
	},
	cardUsers: {
		color: "#EAEAED",
		fontSize: 20,
		fontWeight: "bold",
		marginRight: 20,
	},
	cardStatusIcon: {
		width: 17,
		height: 17,
		marginRight: 7,
	},
	cardStatus: {
		color: "#EAEAED",
		fontSize: 20,
		fontWeight: "bold",
	},
});
