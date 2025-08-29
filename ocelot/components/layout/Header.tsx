import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';


export default function Header() {
  return (
    <View className='flex flex-row justify-between items-center h-[150px] px-[60px] py-10'>
      <View className='flex flex-row justify-start items-center flex-grow-0 flex-shrink-0 w-[162px] h-[60px] relative gap-4'>
        <Text className='text-4xl font-bold text-white' style={{fontFamily: 'DMSans_900Black'}}>ocelot</Text>
      </View>

      <View className='flex flex-row justify-end items-center flex-grow-0 flex-shrink-0 w-[222px] relative gap-[22px]'>
        <Link href="/(main)/minhaconta" asChild>
          <Pressable>
            <Text className='text-lg text-white' style={{fontFamily: 'DMSans_500Medium'}} >Minha conta</Text>

            <View />
          </Pressable>
        </Link>
        <Link href="/(main)/config" asChild>
          <Pressable>
            <Text className='text-lg text-white' style={{fontFamily: 'DMSans_500Medium'}} >Configurações</Text>
          </Pressable>
        </Link>
      </View>

    </View>
  );
}

