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


export default function TaskList() {
  const router = useRouter();

  return (
      <ScrollView>
        <View 
						style={{
							alignItems: "flex-start",
							backgroundColor: "#00000000",
							borderRadius: 10,
							paddingVertical: 13,
							paddingHorizontal: 32,
							marginBottom: 18,
						}}>
						<View 
							style={{
								flexDirection: "row",
								marginBottom: 14,
								marginLeft: 1,
							}}>
							<Text 
								style={{
									color: "#FFFFFF",
									fontSize: 25,
									fontWeight: "bold",
									marginRight: 13,
								}}>
								{"#001"}
							</Text>
							<Text 
								style={{
									color: "#FFFFFF",
									fontSize: 25,
									fontWeight: "bold",
								}}>
								{" Desenvolvimento da tal coisa de tal coisa de num sei oque"}
							</Text>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/4dled7uu_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 20,
									height: 20,
									marginRight: 8,
								}}
							/>
							<Text 
								style={{
									color: "#EAEAED",
									fontSize: 20,
									fontWeight: "bold",
									marginRight: 367,
								}}>
								{"Diego, Gustavo, João"}
							</Text>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hp3LMScHsR/3olhbwpe_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 17,
									height: 17,
									marginRight: 7,
								}}
							/>
							<Text 
								style={{
									color: "#EAEAED",
									fontSize: 20,
									fontWeight: "bold",
								}}>
								{"Em andamento"}
							</Text>
						</View>
					</View>
      </ScrollView>

  );
}


