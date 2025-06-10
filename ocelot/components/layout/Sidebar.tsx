import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { LinkProps } from 'expo-router';
import { styleSidebar } from '../../constants/Colors';

const navItems: NavItem[] = [
  { name: 'Página Inicial', href: '/' },
  { name: 'Projetos', href: '/projects' },
  { name: 'Equipes', href: '/equipes' },
  { name: 'Relatórios', href: '/relatorios' },
  { name: 'Exportar', href: '/exportar' },
];

type NavItem = {
  name: string;
  href: LinkProps['href'];
};

function NavLink({ item }: { item: NavItem }) {
  return (
    <Link href={item.href} asChild>
      <Pressable style={styleSidebar.navItem}>
        <Text style={styleSidebar.navText}>{item.name}</Text>
      </Pressable>
    </Link>
  );}


// O componente principal da Sidebar
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
