import { Text, ScrollView, Pressable} from 'react-native';
import React, { useState } from 'react';
import TeamList from '@/components/layout/TeamList';
import { useRouter } from 'expo-router';



export default function Home() {
    const router = useRouter();
      
    function handleNavigate(url: string) {
        router.push(`/${url}`);
    }

   return(
   <ScrollView>
    <Pressable onPress={() => handleNavigate('equipes/novo')} style={{ 
    backgroundColor: "white",    
    padding: 5, 
    borderRadius: 5, 
    marginRight: 15,
    marginBottom: 15,
    alignSelf: "flex-end",   }}>
    <Text style={{}}>Nova equipe</Text></Pressable>
    <TeamList/>
    </ScrollView>);
}


 

