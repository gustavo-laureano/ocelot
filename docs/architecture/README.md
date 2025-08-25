# Projeto Ocelot - Sistema de Gerenciamento de Projetos

Sistema full-stack para gerenciamento de projetos e equipes, desenvolvido com Node.js (backend) e Expo/React Native (frontend).

## Estrutura do Projeto

```
ocelot/
├── ocelot-backend/           # Backend Node.js/Express
│   ├── routes/              # Rotas da API
│   │   ├── user.js         # Endpoints de usuários
│   │   ├── team.js         # Endpoints de times
│   │   ├── project.js      # Endpoints de projetos
│   │   └── task.js         # Endpoints de tarefas
│   └── database.js         # Configuração do PostgreSQL
│
├── init/                    # Scripts de inicialização
│   └── init.sql            # Schema do banco de dados
│
└── docs/                   # Documentação
    └── architecture/       # Documentação da arquitetura
```
