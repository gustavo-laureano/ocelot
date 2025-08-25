# Guia de Inicialização - Projeto Ocelot

Este guia explica como subir o ambiente completo do Ocelot usando Docker Compose.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

## Passos para Inicialização

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd ocelot
   ```

2. **Configure variáveis de ambiente**

   - Edite o arquivo `.env` na raiz do projeto, se necessário, com as credenciais do banco e configurações do backend.

3. **Suba os containers**

   Na raiz do projeto, execute:

   ```bash
   docker-compose up --build
   ```

   Isso irá:
   - Criar e iniciar o banco de dados PostgreSQL
   - Executar os scripts de inicialização do banco (`init/init.sql`)
   - Subir o backend Node.js/Express já conectado ao banco

4. **Acesse a API**

   - O backend estará disponível em `http://localhost:3000` (ou porta definida no `docker-compose.yml`)
   - Consulte a documentação das rotas na pasta `docs/architecture`

5. **Testes rápidos**

   - Use ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar os endpoints da API.
   - Exemplos de rotas:
     - `POST /user/create`
     - `GET /team/list?userId=1`
     - `POST /project/create`
     - `GET /task/list?project_id=1`

## Parar o ambiente

Para parar e remover os containers:

```bash
docker-compose down
```

## Observações

- O banco de dados é inicializado automaticamente com o schema definido em `init/init.sql`.
- O backend está configurado para se conectar ao banco via variáveis do `.env`.
- Para reiniciar apenas o backend, use:

  ```bash
  docker-compose restart backend
  ```

## Mais informações:

Em caso de dúvidas, consulte a documentação na pasta `docs/architecture` ou abra uma issue no repositório.

---

Pronto! Seu ambiente Ocelot estará rodando e pronto para uso.