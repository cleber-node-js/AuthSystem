// utils/emailService.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST; // Adicione o host
const EMAIL_PORT = process.env.EMAIL_PORT; // Adicione a porta

// Função para enviar o email de verificação
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
        // Configuração do transporte de email (use as variáveis de ambiente)
        const transporter = nodemailer.createTransport({
            host: EMAIL_HOST, // Use a variável de ambiente
            port: Number(EMAIL_PORT),    // Use a variável de ambiente
            secure: true, // Use TLS
            auth: {
                user: EMAIL_USER, // Use a variável de ambiente
                pass: EMAIL_PASS,  // Use a variável de ambiente
            },
        });

        const verificationLink = `http://localhost:3004/auth/verify?token=${token}`; // Ajuste a URL

        // Opções do email
        const mailOptions = {
            from: EMAIL_USER,  // Use a variável de ambiente
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Please click the following link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
        };

        // Envie o email
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);

    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
}