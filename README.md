# AuthSystem

Este é um sistema de autenticação de usuários, gerenciamento de eventos e preferências. O projeto utiliza o Prisma ORM para interagir com um banco de dados PostgreSQL e Docker para facilitar a configuração do ambiente.

## Docker

O projeto usa **Docker** para facilitar a configuração do ambiente de desenvolvimento e a execução do sistema de forma isolada. O ambiente inclui um container para o backend da aplicação e um container para o banco de dados PostgreSQL.

### Requisitos

Antes de rodar os containers, certifique-se de ter o **Docker** e **Docker Compose** instalados em sua máquina.

- [Instalar o Docker](https://docs.docker.com/get-docker/)
- [Instalar o Docker Compose](https://docs.docker.com/compose/install/)

### Como Rodar o Projeto com Docker

### Criara o conatiner

docker-compose up -d

1. **Clone o repositório**:

   ```bash
   git clone git@github.com:Cleber-Canto/AuthSystem.git
   cd AuthSystem


Para adicionar essa explicação no seu **README.md**, você pode incluir uma seção sobre a estrutura do banco de dados e o que cada tabela representa. Isso ajudará outros desenvolvedores ou colaboradores a entenderem rapidamente a organização do projeto e como cada parte se relaciona.

Aqui está um exemplo de como você pode adicionar essa explicação no seu **README.md**:

### Exemplo de Seção no `README.md`

```markdown
# AuthSystem

Este é um sistema de autenticação de usuários, gerenciamento de eventos e preferências. O projeto utiliza o Prisma ORM para interagir com um banco de dados PostgreSQL.

## Estrutura do Banco de Dados

O banco de dados é composto pelas seguintes entidades, cada uma representando um aspecto específico do sistema:

### Tabelas Principais

- **Artista**: Armazena informações sobre artistas que se apresentam nos eventos. Cada artista pode estar associado a múltiplos eventos.
  
  Campos:
  - `id`: Identificador único.
  - `name`: Nome do artista.
  - `description`: Descrição do artista (opcional).
  - `genre`: Gênero musical ou área de atuação.
  - `events`: Relacionamento com a tabela de `Event` (múltiplos eventos).

- **Auth**: Gerencia as informações de autenticação do usuário, como nome de usuário, senha e email.

  Campos:
  - `id`: Identificador único.
  - `username`: Nome de usuário (único).
  - `password`: Senha criptografada.
  - `email`: E-mail (único).

- **Classification**: Classificação dos eventos, como tipo ou categoria (ex: Música, Comédia, etc.).

  Campos:
  - `id`: Identificador único.
  - `name`: Nome da classificação (ex: 'Música', 'Teatro').
  - `description`: Descrição adicional (opcional).
  
- **Establishment**: Informações sobre os locais onde os eventos são realizados.

  Campos:
  - `id`: Identificador único.
  - `name`: Nome do local.
  - `location`: Localização do estabelecimento.

- **Event**: Detalhes sobre os eventos, incluindo título, descrição, data e suas relações com `Artista`, `Classification`, e `Establishment`.

  Campos:
  - `id`: Identificador único.
  - `title`: Título do evento.
  - `description`: Descrição do evento.
  - `date`: Data e hora do evento.
  - `artistaId`: Relacionamento com o artista (opcional).
  - `classificationId`: Relacionamento com a classificação do evento.
  - `establishmentId`: Relacionamento com o local do evento.

- **Favorite**: Tabela de favoritos que registra quais eventos foram marcados como favoritos por usuários específicos.

  Campos:
  - `id`: Identificador único.
  - `eventId`: Relacionamento com a tabela de `Event`.
  - `userId`: Relacionamento com a tabela de `User`.

- **Notification**: Notificações para os usuários, como lembretes de eventos ou atualizações.

  Campos:
  - `id`: Identificador único.
  - `message`: Mensagem da notificação.
  - `read`: Indica se a notificação foi lida.
  - `userId`: Relacionamento com a tabela de `User`.

- **Payment**: Informações sobre os pagamentos realizados para os eventos.

  Campos:
  - `id`: Identificador único.
  - `amount`: Valor do pagamento.
  - `method`: Método de pagamento.
  - `eventId`: Relacionamento com a tabela de `Event`.
  - `userId`: Relacionamento com a tabela de `User`.
  - `status`: Status do pagamento.

- **Rating**: Classificação dos eventos pelos usuários.

  Campos:
  - `id`: Identificador único.
  - `value`: Valor da avaliação (ex: 1-5).
  - `comment`: Comentário adicional (opcional).
  - `eventId`: Relacionamento com a tabela de `Event`.
  - `userId`: Relacionamento com a tabela de `User`.

- **Session**: Tabela de sessões de usuário para autenticação.

  Campos:
  - `id`: Identificador único.
  - `token`: Token de autenticação.
  - `userId`: Relacionamento com a tabela de `User`.
  - `expiresAt`: Data de expiração do token.

- **UserPreference**: Preferências dos usuários (como preferências de tema ou configurações de notificações).

  Campos:
  - `id`: Identificador único.
  - `theme`: Tema preferido (ex: claro ou escuro).
  - `notificationsEnabled`: Define se as notificações estão habilitadas.
  - `userId`: Relacionamento com a tabela de `User`.

- **UserRole**: Funções atribuídas aos usuários (ex: 'admin', 'user').

  Campos:
  - `id`: Identificador único.
  - `role`: Nome da função (ex: 'admin').
  - `userId`: Relacionamento com a tabela de `User`.

- **UserVerificationToken**: Tokens usados para verificar o e-mail do usuário ou outras ações de autenticação.

  Campos:
  - `id`: Identificador único.
  - `token`: Token de verificação.
  - `userId`: Relacionamento com a tabela de `User`.
  - `verified`: Indica se o token foi verificado.
  - `createdAt`: Data de criação do token.

### Como Usar o Prisma

1. **Configuração do Banco de Dados**:
   Configure sua URL do banco de dados no arquivo `.env`:

   ```plaintext
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

2. **Executar as Migrações**:
   Após atualizar o arquivo `schema.prisma`, execute o seguinte comando para gerar as migrações e aplicá-las ao banco de dados:

   ```bash
   npx prisma migrate dev --name add_entities
   ```

3. **Gerar o Prisma Client**:
   Gere o Prisma Client para interagir com o banco de dados:

   ```bash
   npx prisma generate
   ```

4. **Rodar o Projeto**:
   Após configurar o banco de dados e as migrações, inicie o servidor:

   ```bash
   npm run dev
   ```

## Como Contribuir

1. Clone o repositório.
2. Crie uma branch para a sua modificação: `git checkout -b minha-modificacao`.
3. Faça suas modificações e teste localmente.
4. Commit e push para a sua branch.
5. Abra um Pull Request.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
```

### Explicação do README

- A seção **Estrutura do Banco de Dados** detalha cada uma das tabelas e o que elas representam no sistema.
- A seção **Como Usar o Prisma** explica os passos necessários para configurar e aplicar as migrações.
- Inclui também instruções sobre como contribuir no projeto e o comando para rodar o servidor.

Assim, quem for colaborar ou usar o projeto saberá como o banco de dados é estruturado e como começar a trabalhar com o Prisma.