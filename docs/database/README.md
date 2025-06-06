# Documentação do Banco de Dados

Este documento descreve a estrutura, as tabelas e os relacionamentos do banco de dados do projeto Ocelot. O objetivo é fornecer uma referência clara para a equipe de desenvolvimento sobre o modelo de dados da aplicação.

## Diagrama Entidade-Relacionamento (DER)

Abaixo, uma representação visual do nosso banco de dados. Para detalhes, consulte o arquivo `./assets/ocelot-db-schema.svg`

![Diagrama do Banco de Dados do Ocelot](./assets/ocelot-db-schema.svg)

---

## Estrutura das Tabelas

O banco de dados é composto por cinco tabelas principais que gerenciam usuários, equipes, projetos e tarefas.

### Tabela: `USER`

Armazena as informações dos usuários cadastrados no sistema.

| Coluna | Tipo de Dado | Chave/Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| **id** | `int` | **PK** | Identificador único do usuário. |
| `username` | `varchar(45)` | UNIQUE | Nome de usuário para login. |
| `name` | `varchar(45)` | | Nome completo do usuário. |
| `password` | `varchar(255)` | | Senha criptografada do usuário. |
| `email` | `varchar(255)` | UNIQUE | E-mail único do usuário. |
| `phone` | `varchar(20)` | | Telefone de contato. |
| `github` | `varchar(255)` | | URL do perfil no GitHub. |
| `linkedin` | `varchar(255)` | | URL do perfil no LinkedIn. |
| `last_login`| `date` | | Data do último acesso do usuário. |
| `created` | `date` | | Data de criação do registro. |

### Tabela: `TEAM`

Armazena as equipes (times) de trabalho.

| Coluna | Tipo de Dado | Chave/Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| **id** | `int` | **PK** | Identificador único da equipe. |
| `name` | `varchar(45)` | | Nome da equipe. |
| `description` | `TEXT` | | Descrição dos objetivos da equipe. |

### Tabela: `USERS_TEAMS` (Tabela Pivot)

Tabela associativa que define a relação **N:M (muitos-para-muitos)** entre `USER` e `TEAM`.

| Coluna | Tipo de Dado | Chave/Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| **id** | `int` | **PK** | Identificador único da relação. |
| **user_id** | `int` | **FK** | Chave estrangeira que referencia `USER(id)`. |
| **team_id** | `int` | **FK** | Chave estrangeira que referencia `TEAM(id)`. |
| `role` | `varchar(50)` | | Permissão do usuário na equipe (ex: 'admin', 'membro'). |

### Tabela: `PROJECT`

Armazena os projetos gerenciados pelo sistema. Cada projeto pertence a uma equipe e a um responsável.

| Coluna | Tipo de Dado | Chave/Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| **id** | `int` | **PK** | Identificador único do projeto. |
| **team_id**| `int` | **FK** | Chave estrangeira que referencia `TEAM(id)`. |
| **owner** | `int` | **FK** | Chave estrangeira que referencia `USER(id)` (dono do projeto). |
| `name` | `varchar(45)` | | Nome do projeto. |
| `description`| `TEXT` | | Descrição detalhada do escopo do projeto. |
| `start_date`| `date` | | Data de início planejada do projeto. |
| `real_end_date`|`date` | | Data de finalização real do projeto. |
| `status` | `varchar(50)` | | Status atual (ex: 'Planejado', 'Em Andamento', 'Concluído'). |
| `created` | `date` | | Data de criação do registro. |
| `updated` | `date` | | Data da última atualização do registro. |

### Tabela: `TASK`

Armazena as tarefas individuais que compõem um projeto.

| Coluna | Tipo de Dado | Chave/Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| **id** | `int` | **PK** | Identificador único da tarefa. |
| **project_id`**| `int` | **FK** | Chave estrangeira que referencia `PROJECT(id)`. |
| `name` | `varchar(45)` | | Título da tarefa. |
| `description`| `TEXT` | | Descrição detalhada da tarefa. |
| `status` | `varchar(50)` | | Status atual (ex: 'A Fazer', 'Em Progresso', 'Feito'). |
| `priority` | `int` | | Nível de prioridade da tarefa (ex: 1-Baixa, 2-Média, 3-Alta). |
| `created` | `date` | | Data de criação do registro. |
| `updated` | `date` | | Data da última atualização do registro. |

---

## Relacionamentos

* **Um `TEAM` pode ter vários `PROJECT`s**, mas um `PROJECT` pertence a apenas um `TEAM`.
* **Um `PROJECT` pode ter várias `TASK`s**, mas uma `TASK` pertence a apenas um `PROJECT`.
* **Um `USER` pode ser o dono (owner) de vários `PROJECT`s**.
* **A relação entre `USER` e `TEAM` é de muitos-para-muitos**, gerenciada pela tabela `USERS_TEAMS`. Isso significa que um usuário pode pertencer a várias equipes e uma equipe pode ter vários usuários, cada um com uma permissão (`role`) específica.