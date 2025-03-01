"use strict";
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { PrismaClient, User } from '@prisma/client';
// import dotenv from 'dotenv';
// dotenv.config();
// const prisma = new PrismaClient();
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID!,  // Certifique-se de que estas variáveis estão definidas em seu .env
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   callbackURL: '/auth/google/callback',
//   passReqToCallback: true
// }, async (req, _accessToken, _refreshToken, profile, done) => {
//   try {
//     const email = profile.emails && profile.emails[0]?.value; // Adiciona verificação para evitar erros
//     const displayName = profile.displayName;
//     if (!email) {
//       return done(new Error('Email not provided'), false); // Verificação adicional
//     }
//     let user: User | null = await prisma.user.findUnique({
//       where: { email }
//     });
//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           email: email,
//           name: displayName,
//           profileType: 'CLIENT', // Use o valor correto conforme seu Enum
//           status: 'ACTIVE', // Use o valor correto conforme seu Enum
//           password: 'your_password_here', // É recomendável não armazenar senhas que não sejam criptografadas
//           // Adicione outros campos conforme necessário
//         }
//       });
//     }
//     done(null, user);
//   } catch (error) {
//     console.error("Error in Google Strategy:", error);
//     done(error, false);
//   }
// }));
// passport.serializeUser((user: any, done) => {
//   done(null, user.id); // Usa o ID do usuário para serialização
// });
// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const userId = parseInt(id, 10); // Convert the id from string to number
//     const user = await prisma.user.findUnique({
//       where: { id: userId } // Use the converted id
//     });
//     done(null, user);
//   } catch (error) {
//     console.error("Error while deserializing user:", error);
//     done(error, null);
//   }
// });
// export default passport;
//# sourceMappingURL=passport.js.map