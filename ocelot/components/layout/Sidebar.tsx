import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import type { LinkProps } from "expo-router";
import { COLORS } from "@/constants/theme";
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";

const navItems: NavItem[] = [
  { name: "Página Inicial", href: "/" },
  { name: "Projetos", href: "/projetos" },
  { name: "Equipes", href: "/equipes" },
  { name: "Relatórios", href: "/relatorios" },
  { name: "Exportar", href: "/exportar" },
];

type NavItem = {
  name: string;
  href: LinkProps["href"];
  };

function NavLink({ item }: { item: NavItem }) {
  return (
    <View className="flex flex-col justify-start items-start px-[20px] relative gap-2.5">
    <Link href={item.href} asChild>
      <Pressable>
        <Text className="self-stretch flex-grow-0 flex-shrink-0 text-2xl font-medium text-left text-white" style={{ fontFamily: 'DMSans_400Regular' }}>{item.name}</Text>
      </Pressable>
    </Link>
    </View>
  );
}

export default function Sidebar() {
  return (
    <View className="px-[20px] py-[20px] w-[280px] h-[874px] gap-5" >
      <Text className="px-[20px]  text-2xl text-white" style={{ fontFamily: 'DMSans_600SemiBold' }}>PESQUISAR</Text>
      <View className="gap-2.5">
        {navItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </View>
    </View>
  );
}
