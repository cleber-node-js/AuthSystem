/src
  /controllers
    /accountController.ts
    /eventController.ts
    /userController.ts
  /routes
    /accountRoutes.ts
    /eventRoutes.ts
    /userRoutes.ts
  /services
    /accountService.ts
    /eventService.ts
    /userService.ts
  /models
    /prismaClient.ts
    /userModel.ts
    /eventModel.ts
    /accountModel.ts
  /middlewares
    /authMiddleware.ts
  /utils
    /jwtUtils.ts
  /config
    /config.ts
  /app.ts
  /server.ts
  /prisma
    /schema.prisma


Para rodar o **Prisma Studio** no seu projeto, siga estes passos:

### 1️⃣ **Certifique-se de que o Prisma está instalado**
Se você ainda não instalou o Prisma, execute:  
```sh
npm install @prisma/client
```
E, se ainda não configurou, inicialize o Prisma no projeto:
```sh
npx prisma init
```

### 2️⃣ **Crie e aplique as migrações**
Se tiver um **schema.prisma**, gere as tabelas no banco de dados:
```sh
npx prisma migrate dev --name init
```
Isso cria e aplica as migrações no banco.

### 3️⃣ **Rodar o Prisma Studio**
Agora, para abrir o **Prisma Studio** e visualizar seus dados, execute:
```sh
npx prisma studio
```
Isso abrirá uma interface gráfica no navegador para gerenciar o banco.

Caso tenha algum erro, me avise que te ajudo a corrigir! 🚀