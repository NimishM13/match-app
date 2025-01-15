import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs";
import { loginSchema } from "./lib/schemas/LoginSchema";

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token }) {
            console.log({ token });
            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub; // Attach the user ID to the session
            }
            return session;
        },
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Validate the credentials using your schema
                const validated = loginSchema.safeParse(credentials);
                if (!validated.success) {
                    throw new Error("Invalid credentials");
                }

                const { email, password } = validated.data;
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    throw new Error("User not found");
                }

                const isPasswordValid = await compare(password, user.passwordHash);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return user; // Return the user object for the session token
            },
        }),
    ],
};

export default NextAuth(authOptions);