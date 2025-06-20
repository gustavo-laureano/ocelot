import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import type { LinkProps } from "expo-router";
import { tintColorLight, purpleLight, midDarkPurple } from "@/constants/theme";

const navItems: NavItem[] = [
  { name: "Página Inicial", href: "/" },
  { name: "Projetos", href: "/projects" },
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
    <Link href={item.href} asChild>
      <Pressable style={styleSidebar.navItem}>
        <Text style={styleSidebar.navText}>{item.name}</Text>
      </Pressable>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <View style={styleSidebar.sidebarContainer}>
      <Text style={styleSidebar.title}>PESQUISAR</Text>
      <View style={styleSidebar.navGroup}>
        {navItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </View>
    </View>
  );
}

export const styleSidebar = StyleSheet.create({
  sidebarContainer: {
    width: 250,
    padding: 20,
    paddingLeft: 50,
  },
  title: {
    color: tintColorLight,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  navGroup: {
    gap: 5,
  },
  navItem: {
    textAlign: "left",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: purpleLight,
    borderColor: midDarkPurple,
  },
  navText: {
    color: tintColorLight,
    fontSize: 18,
    fontWeight: "400",
  },
});
