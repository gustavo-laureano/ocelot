import { useRouter, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, SafeAreaView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { GlobalText, FONT_FAMILY, purpleDark } from "../../../constants/theme";
import React, { useState } from "react";
import TaskList from "@/components/layout/TaskList";

export default function PaginaDoProjeto() {
	const router = useRouter();
	const { id } = useLocalSearchParams();

	

	const [textInput1, setTextInput1] = useState("");

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.headerContainer}>
					<Image
						source={{
							uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/dt6juf8t_expires_30_days.png",
						}}
						resizeMode={"stretch"}
						style={styles.headerImage}
					/>
					<View style={styles.headerTextContainer}>
						<Text style={styles.headerTitle}>{"Nome do projeto"}</Text>
						<Text style={styles.headerSubtitle}>{"Nome do projeto"}</Text>
					</View>
				</View>
				<View style={styles.tabsContainer}>
					<TouchableOpacity style={styles.tabButton} onPress={() => alert("Pressed!")}>
						<Text style={styles.tabButtonText}>{"Lista"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabButton} onPress={() => alert("Pressed!")}>
						<Text style={styles.tabButtonText}>{"Kanban"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabButton} onPress={() => alert("Pressed!")}>
						<Text style={styles.tabButtonText}>{"Calendário"}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.cardContainer}>
					<View style={styles.cardTitleRow}>
						<Text style={styles.cardId}>{"#001"}</Text>
						<Text style={styles.cardTitle}>{" Desenvolvimento da tal coisa de tal coisa de num sei oque"}</Text>
					</View>
					<View style={styles.cardInfoRow}>
						<Image
							source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/4dled7uu_expires_30_days.png" }}
							resizeMode={"stretch"}
							style={styles.cardUserIcon}
						/>
						<Text style={styles.cardUsers}>{"Diego, Gustavo, João"}</Text>
						<Image
							source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/3olhbwpe_expires_30_days.png" }}
							resizeMode={"stretch"}
							style={styles.cardStatusIcon}
						/>
						<Text style={styles.cardStatus}>{"Em andamento"}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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
		marginRight: 367,
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
