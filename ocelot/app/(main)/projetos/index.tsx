import { View, Text, ScrollView, Pressable, StyleSheet, Modal} from 'react-native';
import React, { useState } from 'react';
import { Title, Card, ScrollViewer } from '@/constants/theme';
import ProjectList from '@/components/layout/ProjectList';
import ProjectCreate from '@/components/layout/ProjectCreate';
import { purpleDark } from '@/constants/theme';
import { useRouter } from 'expo-router';



export default function Home() {
    const router = useRouter();
      
    function handleNavigate(url: string) {
        router.push(`/${url}`);
    }

   return(
   <ScrollView>
    <Pressable onPress={() => handleNavigate('projetos/novo')} style={{ 
    backgroundColor: "white",    
    padding: 5, 
    borderRadius: 5, 
    marginRight: 15,
    marginBottom: 15,
    alignSelf: "flex-end",   }}>
    <Text style={{}}>Novo Projeto</Text></Pressable>
    <ProjectList/>
    </ScrollView>);
}


 

