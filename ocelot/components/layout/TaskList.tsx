import { Card, Title } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL } from '@/constants/env';

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

type Task = {
	id: number;
	project_id: number;
	name: string;
	description: string;
	status: string;
	priority: string;
	created: string;
	updated: string;
};

export default function TaskList() {
	const router = useRouter();
	const { id: project_id } = useLocalSearchParams();

	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("userId");

	const [tasks, setProjects] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function deleteProject(task_id: number) {
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
								`${API_URL}/task/delete?task_id=${task_id}`,
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
									errorData.message || `Falha ao excluir task com ID ${task_id}`,
								);
							}

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
					`http://localhost:3000/task/list?project_id=${project_id}`,
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

	return (
		<ScrollView>
			{tasks.map((task) => (
				<View key={task.id} style={styles.taskContainer}>
					<View style={styles.headerRow}>
						<Text style={styles.taskId}>
							{"#" + task.id.toString().padStart(3, "0")}
						</Text>
						<Text style={styles.taskName}>{task.name}</Text>
					</View>
					<View style={styles.infoRow}>
						<Image
							source={{
								uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/4dled7uu_expires_30_days.png",
							}}
							resizeMode={"stretch"}
							style={styles.iconLeft}
						/>
						<Text style={styles.taskDescription}>{task.description}</Text>
						<Image
							source={{
								uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/3olhbwpe_expires_30_days.png",
							}}
							resizeMode={"stretch"}
							style={styles.iconRight}
						/>
						<Text style={styles.taskStatus}>{task.status}</Text>
					</View>
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	taskContainer: {
		alignItems: "flex-start",
		backgroundColor: "#00000000",
		borderRadius: 10,
		paddingVertical: 13,
		paddingHorizontal: 32,
		marginBottom: 18,
	},
	headerRow: {
		flexDirection: "row",
		marginBottom: 14,
		marginLeft: 1,
	},
	taskId: {
		color: "#FFFFFF",
		fontSize: 25,
		fontWeight: "bold",
		marginRight: 13,
	},
	taskName: {
		color: "#FFFFFF",
		fontSize: 25,
		fontWeight: "bold",
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		width: "90%",
	},
	iconLeft: {
		width: 20,
		height: 20,
		marginRight: 8,
	},
	taskDescription: {
		color: "#EAEAED",
		fontSize: 20,
		fontWeight: "bold",
		marginRight: 367,
	},
	iconRight: {
		width: 17,
		height: 17,
		marginRight: 7,
	},
	taskStatus: {
		color: "#EAEAED",
		fontSize: 20,
		fontWeight: "bold",
	},
});
