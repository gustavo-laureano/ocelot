# Arquitetura do Projeto Ocelot (Expo)

Este documento descreve a arquitetura do projeto Ocelot, desenvolvido com [Expo](https://expo.dev/) e React Native. O objetivo é fornecer uma visão geral da organização do código, principais responsabilidades de cada camada e boas práticas adotadas.

---

## Visão Geral

O Ocelot é um aplicativo multiplataforma (mobile e web) estruturado para facilitar a manutenção, escalabilidade e colaboração entre equipes. O projeto utiliza **file-based routing** (roteamento baseado em arquivos) do Expo Router, separação clara de responsabilidades e um tema centralizado.

---

## Estrutura de Pastas

```
ocelot/
│
├── app/                # Rotas e telas principais do app (Expo Router)
│   ├── (main)/         # Rotas agrupadas (ex: projetos, equipes, etc.)
│   │   ├── projetos/
│   │   │   ├── [id].tsx      # Tela de detalhes do projeto
│   │   │   ├── index.tsx     # Lista de projetos
│   │   │   └── novo.tsx      # Criação de projeto
│   │   ├── equipes/
│   │   ├── login/
│   │   ├── minhaconta/
│   │   └── ...               # Outras rotas
│   └── _layout.tsx     # Layout principal (Header, Sidebar, Slot)
│
├── components/         # Componentes reutilizáveis
│   └── layout/         # Componentes de layout (Header, Sidebar, ProjectList, etc.)
│
├── constants/          # Temas, cores, fontes e estilos globais
│   └── theme.ts
│
├── assets/             # Imagens, fontes e outros recursos estáticos
│   ├── fonts/
│   └── images/
│
├── scripts/            # Scripts utilitários (reset, build, etc.)
│
├── .expo/              # Configurações do Expo
│
├── package.json
├── tsconfig.json
└── ...
```

---

## Camadas e Responsabilidades

- **app/**  
  Define as rotas e telas principais. Cada arquivo ou pasta representa uma rota.  
  Usa o Expo Router para navegação baseada em arquivos.

- **components/layout/**  
  Componentes visuais reutilizáveis e de layout, como listas, formulários, cabeçalhos, etc.

- **constants/theme.ts**  
  Centraliza cores, fontes (ex: DM_SANS), estilos globais e helpers para manter a identidade visual consistente.

- **assets/**  
  Armazena imagens, ícones e fontes customizadas usadas no app.

- **scripts/**  
  Scripts para automação de tarefas de desenvolvimento.

---

## Fluxo de Dados

- **Autenticação:**  
  Tokens e IDs de usuário são armazenados localmente (ex: AsyncStorage) e utilizados nas requisições para o backend.

- **Comunicação com Backend:**  
  Todas as chamadas à API são feitas via `fetch`, utilizando endpoints RESTful definidos no backend Express.

- **Gerenciamento de Estado:**  
  O estado local é gerenciado principalmente com React Hooks (`useState`, `useEffect`).  
  Para estados globais, recomenda-se o uso de Context API ou bibliotecas como Redux, se necessário.

---

## Temas e Estilos

- O tema (cores, fontes, espaçamentos) é centralizado em `constants/theme.ts`.
- A fonte padrão do app é **DM_SANS**, aplicada globalmente via estilos.
- Componentes e telas devem sempre importar e utilizar os estilos do tema para garantir consistência visual.

---

## Boas Práticas

- **Separação de responsabilidades:**  
  Componentes pequenos e reutilizáveis, lógica de negócio separada da apresentação.

- **Reutilização:**  
  Use componentes de layout para evitar duplicação de código.

- **Padronização:**  
  Sempre utilize as cores, fontes e estilos definidos no tema.

- **Acessibilidade:**  
  Prefira componentes nativos do React Native e siga boas práticas de acessibilidade.

---

## Observações

- O projeto está preparado para rodar tanto em dispositivos móveis quanto na web (via Expo).
- Para adicionar novas rotas, basta criar um novo arquivo ou pasta dentro de `app/(main)/`.
- Para adicionar novos componentes, utilize a pasta `components/layout/`.

---

## Referências

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)